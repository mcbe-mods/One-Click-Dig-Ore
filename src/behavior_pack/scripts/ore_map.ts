/* eslint-disable camelcase */
const iron = {
  item: 'raw_iron',
  xp: [0, 0],
  probability: [1, 1],
  support: {
    fortune: true,
    silk_touch: true
  }
}

const gold = {
  item: 'raw_gold',
  xp: [0, 0],
  probability: [1, 1],
  support: {
    fortune: true,
    silk_touch: true
  }
}

// eslint-disable-next-line camelcase
const nether_gold = {
  item: 'gold_nugget',
  xp: [0, 1],
  probability: [2, 6],
  support: {
    fortune: true,
    silk_touch: true
  }
}

const diamond = {
  item: 'diamond',
  xp: [3, 7],
  probability: [1, 1],
  support: {
    fortune: true,
    silk_touch: true
  }
}

const lapis = {
  item: 'lapis_lazuli',
  xp: [2, 5],
  probability: [4, 9],
  support: {
    fortune: true,
    silk_touch: true
  }
}
const redstone = {
  item: 'redstone',
  xp: [1, 5],
  probability: [4, 5],
  support: {
    fortune: true,
    silk_touch: true
  }
}

const coal = {
  item: 'coal',
  xp: [0, 2],
  probability: [1, 1],
  support: {
    fortune: true,
    silk_touch: true
  }
}

const copper = {
  item: 'raw_copper',
  xp: [0, 0],
  probability: [2, 5],
  support: {
    fortune: true,
    silk_touch: true
  }
}

const emerald = {
  item: 'emerald',
  xp: [3, 7],
  probability: [1, 1],
  support: {
    fortune: true,
    silk_touch: true
  }
}

const quartz = {
  item: 'quartz',
  xp: [2, 5],
  probability: [1, 1],
  support: {
    fortune: true,
    silk_touch: true
  }
}

const obsidian = {
  item: 'obsidian',
  xp: [0, 0],
  probability: [1, 1],
  support: {
    fortune: false,
    silk_touch: true
  }
}

const crying_obsidian = {
  item: 'crying_obsidian',
  xp: [0, 0],
  probability: [1, 1],
  support: {
    fortune: false,
    silk_touch: true
  }
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
