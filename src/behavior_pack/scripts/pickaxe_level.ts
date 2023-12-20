const wooden = [
  'minecraft:coal_ore',
  'minecraft:deepslate_coal_ore',
  'minecraft:quartz_ore',
  'minecraft:nether_gold_ore'
]
const golden = wooden
const stone = [
  ...wooden,
  'minecraft:copper_ore',
  'minecraft:deepslate_copper_ore',
  'minecraft:lapis_ore',
  'minecraft:deepslate_lapis_ore',
  'minecraft:iron_ore',
  'minecraft:deepslate_iron_ore'
]
const iron = [
  ...stone,
  'minecraft:gold_ore',
  'minecraft:deepslate_gold_ore',
  'minecraft:nether_gold_ore',
  'minecraft:redstone_ore',
  'minecraft:deepslate_redstone_ore',
  'minecraft:lit_redstone_ore',
  'minecraft:lit_deepslate_redstone_ore',
  'minecraft:diamond_ore',
  'minecraft:deepslate_diamond_ore',
  'minecraft:emerald_ore',
  'minecraft:deepslate_emerald_ore'
]
const diamond = [...iron, 'minecraft:ancient_debris', 'minecraft:obsidian', 'minecraft:crying_obsidian']
const netherite = diamond

export default {
  'minecraft:wooden_pickaxe': wooden,
  'minecraft:stone_pickaxe': stone,
  'minecraft:iron_pickaxe': iron,
  'minecraft:golden_pickaxe': golden,
  'minecraft:diamond_pickaxe': diamond,
  'minecraft:netherite_pickaxe': netherite
}
