/* eslint-disable max-depth */
/* eslint-disable camelcase */
import {
  world,
  ItemStack,
  ItemLockMode,
  GameMode,
  Player,
  Vector3,
  Dimension,
  EquipmentSlot,
  EntityEquippableComponent,
  ItemDurabilityComponent,
  ItemEnchantsComponent
} from '@minecraft/server'
import { splitGroups, getRandomRangeValue, getRadiusRange } from '@mcbe-mods/utils'

import pickaxe_level from './pickaxe_level'
import ore_map from './ore_map'

const isSurvivalPlayer = (dimension: Dimension, player: Player) =>
  dimension.getPlayers({ gameMode: GameMode.survival }).some((p) => p.name === player.name)

world.afterEvents.playerBreakBlock.subscribe(async (e) => {
  const { dimension, player, block } = e
  const currentBreakBlock = e.brokenBlockPermutation
  const blockTypeId = currentBreakBlock.type.id
  digOre(player, dimension, block.location, blockTypeId)
})

/**
 *
 * @param {Player} player
 * @param {Dimension} dimension
 * @param {Vector3} location
 * @param {string} blockTypeId
 * @returns
 */
// eslint-disable-next-line max-statements
async function digOre(player: Player, dimension: Dimension, location: Vector3, blockTypeId: string) {
  const equipmentInventory = player.getComponent(EntityEquippableComponent.componentId)
  if (!equipmentInventory) return

  const mainHand = equipmentInventory.getEquipmentSlot(EquipmentSlot.Mainhand)

  try {
    const currentSlotItem = mainHand.getItem()
    if (!currentSlotItem) return

    const pickaxe = pickaxe_level[currentSlotItem.typeId as keyof typeof pickaxe_level]

    // The player is not stalking or not holding an axe, one of the conditions is not met will end directly
    if (!player.isSneaking || !currentSlotItem?.typeId.endsWith('_pickaxe')) return

    const survivalPlayer = isSurvivalPlayer(dimension, player)

    if (survivalPlayer) mainHand.lockMode = ItemLockMode.slot

    const itemDurability = currentSlotItem.getComponent(ItemDurabilityComponent.componentId)
    const enchantments = currentSlotItem.getComponent(ItemEnchantsComponent.componentId)

    if (!enchantments || !itemDurability) return

    const unbreaking = enchantments.enchantments.hasEnchantment('unbreaking')
    const silk_touch = enchantments.enchantments.hasEnchantment('silk_touch')
    const fortune = enchantments.enchantments.hasEnchantment('fortune')
    // https://minecraft.fandom.com/wiki/Unbreaking
    let itemMaxDamage = itemDurability.damage * (1 + unbreaking)
    const itemMaxDurability = itemDurability.maxDurability * (1 + unbreaking)

    const blockTypeIdRemoveLit = blockTypeId.replace('lit_', '')

    /**
     * Store all coordinates of the same wood type
     * @type { Set<string> }
     */
    const set = new Set()

    const stack = [...getRadiusRange(location)]
    // Iterative processing of proximity squares
    while (stack.length > 0) {
      // Get from the last one (will modify the original array)
      const _block = dimension.getBlock(stack.shift()!)

      if (!_block) continue

      const typeId = _block.typeId

      // handle lit_redstone_ore
      const isEqual = typeId.replace('lit_', '') === blockTypeIdRemoveLit
      if (isEqual && pickaxe.includes(typeId)) {
        const pos = JSON.stringify(_block.location)

        // If the coordinates exist, skip this iteration and proceed to the next iteration
        if (set.has(pos)) continue

        itemMaxDamage++
        if (survivalPlayer && itemMaxDamage >= itemMaxDurability) {
          continue
        }

        // Asynchronous execution to reduce game lag and game crashes
        await new Promise<void>((resolve) => {
          _block.setType('air')
          resolve()
        })

        set.add(pos)

        // Get the squares adjacent to the new wood to append to the iteration stack
        stack.push(...getRadiusRange(_block.location))
      }
    }

    if (silk_touch) {
      // Generate aggregated drops based on the number of item drops to reduce the number of physical drops in the game
      splitGroups(set.size).forEach((group) => {
        dimension.spawnItem(new ItemStack(blockTypeIdRemoveLit, group), location)
      })
    } else {
      const _ore = ore_map[blockTypeId as keyof typeof ore_map] || {
        item: 'air',
        xp: [0, 0],
        probability: [0, 0]
      }
      // Avoid modifying reference types
      const ore = {
        item: _ore.item,
        xp: [..._ore.xp],
        probability: [..._ore.probability]
      }

      // add fortune
      if (fortune) {
        const maxProbability = ore.probability.pop() as number
        ore.probability.push(maxProbability + fortune)
      }

      // Calculate the probability of drops
      const oreMap = { item: 0, xp: 0 }
      for (let i = 0; i < set.size; i++) {
        oreMap.xp += getRandomRangeValue(ore.xp[0], ore.xp[1])
        oreMap.item += getRandomRangeValue(ore.probability[0], ore.probability[1])
      }

      // spawn experience orbs
      for (let i = 0; i < oreMap.xp; i++) {
        dimension.spawnEntity('xp_orb', player.location)
      }

      // Generate aggregated drops based on the number of item drops to reduce the number of physical drops in the game
      splitGroups(oreMap.item).forEach((group) => {
        dimension.spawnItem(new ItemStack(ore.item, group), location)
      })
    }

    if (survivalPlayer) {
      // Set axe damage level
      const damage = Math.ceil((itemMaxDamage * 1) / (1 + unbreaking))
      itemDurability.damage = damage > itemDurability.maxDurability ? itemDurability.maxDurability : damage
      mainHand.setItem(currentSlotItem)
    }
  } catch (_error) {
    /* eslint-disable no-console */
    const error = _error as Error
    console.error(error.name)
    console.error(error.message)
    console.error(error)
    /* eslint-enable no-console */
  } finally {
    mainHand.lockMode = ItemLockMode.none
  }
}
