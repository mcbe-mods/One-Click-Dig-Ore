import {
  world,
  Dimension,
  ItemStack,
  Player,
  EntityInventoryComponent,
  ItemDurabilityComponent,
  ItemEnchantsComponent,
  MinecraftBlockTypes,
  MinecraftItemTypes
} from '@minecraft/server'

import { getBlockNear, splitGroups, isSurvivalPlayer, getRandomRangeValue } from './utils'
import pickaxe_level from './pickaxe_level'
import ore_map from './ore_map'

/**
 * @typedef { {x: number; y: number; z: number} } Location
 */

world.afterEvents.blockBreak.subscribe(async (e) => {
  const { dimension, player, block } = e
  const currentBreakBlock = e.brokenBlockPermutation
  const blockTypeId = currentBreakBlock.type.id
  digOre(player, dimension, block.location, blockTypeId)
})

/**
 *
 * @param {Player} player
 * @param {Dimension} dimension
 * @param {Location} location
 * @param {string} blockTypeId
 * @returns
 */
async function digOre(player, dimension, location, blockTypeId) {
  const currentSlot = player.selectedSlot
  /** @type {EntityInventoryComponent} */
  const inventory = player.getComponent('inventory')
  const currentSlotItem = inventory.container.getItem(currentSlot)
  const pickaxeSlot = inventory.container.getSlot(currentSlot)
  const pickaxe = pickaxe_level[currentSlotItem.typeId]

  // The player is not stalking or not holding an axe, one of the conditions is not met will end directly
  if (!player.isSneaking || !currentSlotItem?.typeId.endsWith('_pickaxe')) return

  try {
    const survivalPlayer = isSurvivalPlayer(dimension, player)

    if (survivalPlayer) pickaxeSlot.lockMode = 'slot'

    /** @type {ItemDurabilityComponent} */
    const itemDurability = currentSlotItem.getComponent('minecraft:durability')
    /** @type {ItemEnchantsComponent} */
    const enchantments = currentSlotItem.getComponent('minecraft:enchantments')
    const unbreaking = enchantments.enchantments.hasEnchantment('unbreaking')
    const silk_touch = enchantments.enchantments.hasEnchantment('silk_touch')
    const fortune = enchantments.enchantments.hasEnchantment('fortune')
    // https://minecraft.fandom.com/wiki/Unbreaking
    let itemMaxDamage = itemDurability.damage * (1 + unbreaking)
    const itemMaxDurability = itemDurability.maxDurability * (1 + unbreaking)

    /**
     * Store all coordinates of the same wood type
     * @type { Set<string> }
     */
    const set = new Set()

    const stack = [...getBlockNear(dimension, location)]
    // Iterative processing of proximity squares
    while (stack.length > 0) {
      // Get from the last one (will modify the original array)
      const _block = stack.shift()

      if (!_block) continue

      const typeId = _block.typeId

      // handle lit_redstone_ore
      const isEqual = typeId.replace('lit_', '') === blockTypeId.replace('lit_', '')
      if (isEqual && pickaxe.includes(typeId)) {
        const pos = JSON.stringify(_block.location)

        // If the coordinates exist, skip this iteration and proceed to the next iteration
        if (set.has(pos)) continue

        itemMaxDamage++
        if (survivalPlayer && itemMaxDamage >= itemMaxDurability) {
          continue
        }

        // Asynchronous execution to reduce game lag and game crashes
        await new Promise((resolve) => {
          _block.setType(MinecraftBlockTypes.air)
          resolve()
        })

        set.add(pos)

        // Get the squares adjacent to the new wood to append to the iteration stack
        stack.push(...getBlockNear(dimension, _block.location))
      }
    }

    /** @type { { item: ItemType; xp: number[]; probability: number[]; }; } */
    const _ore = ore_map[blockTypeId] || { item: MinecraftBlockTypes.air, xp: [0, 0], probability: [0, 0] }
    // Avoid modifying reference types
    const ore = {
      item: _ore.item,
      xp: [..._ore.xp],
      probability: [..._ore.probability]
    }

    // add fortune
    if (fortune) {
      const maxProbability = ore.probability.pop()
      ore.probability.push(maxProbability + fortune)
    }

    // Calculate the probability of drops
    const oreMap = { item: 0, xp: 0 }
    for (let i = 0; i < set.size; i++) {
      oreMap.xp += getRandomRangeValue(...ore.xp)
      oreMap.item += getRandomRangeValue(...ore.probability)
    }

    // spawn experience orbs
    for (let i = 0; i < oreMap.xp; i++) {
      dimension.spawnEntity('xp_orb', player.location)
    }

    // Generate aggregated drops based on the number of item drops to reduce the number of physical drops in the game
    splitGroups(oreMap.item).forEach((group) => {
      const item = silk_touch ? blockTypeId : ore.item
      dimension.spawnItem(new ItemStack(item, group), location)
    })

    if (survivalPlayer) {
      // Set axe damage level
      const damage = Math.ceil((itemMaxDamage * 1) / (1 + unbreaking))
      itemDurability.damage = damage > itemDurability.maxDurability ? itemDurability.maxDurability : damage
      inventory.container.setItem(currentSlot, currentSlotItem)
    }
  } catch (_error) {
    /** @type {Error} */
    const error = _error
    console.error(error.name)
    console.error(error.message)
    console.error(error)
  } finally {
    pickaxeSlot.lockMode = 'none'
  }
}
