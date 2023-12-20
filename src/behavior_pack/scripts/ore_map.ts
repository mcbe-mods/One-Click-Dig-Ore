/* eslint-disable camelcase */
const iron = {
  item: 'raw_iron',
  xp: [0, 0],
  probability: [1, 1]
}

const gold = {
  item: 'raw_gold',
  xp: [0, 0],
  probability: [1, 1]
}

// eslint-disable-next-line camelcase
const nether_gold = {
  item: 'gold_nugget',
  xp: [0, 1],
  probability: [2, 6]
}

const diamond = {
  item: 'diamond',
  xp: [3, 7],
  probability: [1, 1]
}

const lapis = {
  item: 'lapis_lazuli',
  xp: [2, 5],
  probability: [4, 9]
}
const redstone = {
  item: 'redstone',
  xp: [1, 5],
  probability: [4, 5]
}

const coal = {
  item: 'coal',
  xp: [0, 2],
  probability: [1, 1]
}

const copper = {
  item: 'raw_copper',
  xp: [0, 0],
  probability: [2, 5]
}

const emerald = {
  item: 'emerald',
  xp: [3, 7],
  probability: [1, 1]
}

const quartz = {
  item: 'quartz',
  xp: [2, 5],
  probability: [1, 1]
}

const obsidian = {
  item: 'obsidian',
  xp: [0, 0],
  probability: [1, 1]
}

const crying_obsidian = {
  item: 'crying_obsidian',
  xp: [0, 0],
  probability: [1, 1]
}

export default {
  'minecraft:iron_ore': iron,
  'minecraft:deepslate_iron_ore': iron,
  'minecraft:gold_ore': gold,
  'minecraft:deepslate_gold_ore': gold,
  'minecraft:nether_gold_ore': nether_gold,
  'minecraft:diamond_ore': diamond,
  'minecraft:deepslate_diamond_ore': diamond,
  'minecraft:lapis_ore': lapis,
  'minecraft:deepslate_lapis_ore': lapis,
  'minecraft:redstone_ore': redstone,
  'minecraft:deepslate_redstone_ore': redstone,
  'minecraft:lit_redstone_ore': redstone,
  'minecraft:lit_deepslate_redstone_ore': redstone,
  'minecraft:coal_ore': coal,
  'minecraft:deepslate_coal_ore': coal,
  'minecraft:copper_ore': copper,
  'minecraft:deepslate_copper_ore': copper,
  'minecraft:emerald_ore': emerald,
  'minecraft:deepslate_emerald_ore': emerald,
  'minecraft:quartz_ore': quartz,
  'minecraft:obsidian': obsidian,
  'minecraft:crying_obsidian': crying_obsidian
}
