Game.ItemRepository = new Game.Repository('items', Game.Item);

Game.ItemRepository.Symbol = {
'blade': String.fromCharCode(124), // 124 |
'polearm': String.fromCharCode(47), // 47 /
'wearable': String.fromCharCode(197), // 197 ringed A
'jewelry': String.fromCharCode(61), // 61 =
'potion': String.fromCharCode(33), // 33 !
'scroll': String.fromCharCode(167), // Section sign
'shooter': String.fromCharCode(162), // 162 cent sign 
'ammo': String.fromCharCode(171), // 171 Left double angle quotes
'food': String.fromCharCode(176), // 176 degree sign
'tool': String.fromCharCode(172), // 172 logical not
'mineral': String.fromCharCode(164), // 164 currency symbol 
'crafting ingredient': String.fromCharCode(230), // 230 tiny linked ae
'container': '?'
};


//////////////////////////////////////////////

//Game.DynamicGlyph.itemPile = new Game.DynamicGlyph({
//    'character':'&',
//    'foreground':'black',
//    'background':'white',
//    mixins: [Game.ItemMixins.ItemPile]
//    });

// ----------------------------------------------

// food & corpse
Game.ItemRepository.define('jelly ball', {
    name: 'jelly ball',
    group: 'food',
    character: Game.ItemRepository.Symbol['food'],
    invWeight: 450,
    invBulk: 350,
    foreground: 'red',
    foodValue: 50,
    description: "Fairly small, but dense. It's translucent and the outer surface seems pretty dry. The insides look like they're the consistency of jello. The air around it smells mildly acidic and a bit cinnamon-y. The anaylzer says it's not poisonous. Probably.",
    mixins: [Game.ItemMixins.Edible]
});

Game.ItemRepository.define('geodic nut', {
    name: 'geodic nut',
    group: 'food',
    character: Game.ItemRepository.Symbol['food'],
    invWeight: 1300,
    invBulk: 900,
    foreground: 'lightGreen',
    foodValue: 160,
    description: "This reminds you of a cross between a coconut and a geode. When you open it up the inside is filled with a soft greyish material that tastes bland and feels a bit chalky, but at least it's apparently nutritious.",
    rangedAttackDamageBonus: 6,
    mixins: [Game.ItemMixins.Edible,Game.ItemMixins.Ammo]
});

Game.ItemRepository.define('powerbar', {
    name: 'powerbar',
    group: 'food',
    character: Game.ItemRepository.Symbol['food'],
    invWeight: 200,
    invBulk: 100,
    foreground: '#58c',
    foodValue: 460,
    description: "Visually appealing, a delight to the taste buds, and containing multiple meals worth of sustenance. Well..... one out of three aint bad...",
    mixins: [Game.ItemMixins.Edible]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('corpse', {
    name: 'corpse',
    group: 'corpse',
    supergroup: 'corpse',
    character: String.fromCharCode(169), // copyright symbol
    foodValue: 5,
    consumptions: 1,
    description: "A chilling reminder of your own mortality",
    mixins: [Game.ItemMixins.Edible]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('human corpse', {
    name: 'human corpse',
    group: 'corpse',
    supergroup: 'corpse',
    character: '@',
    invWeight: 82000,
    invBulk: 74000,
    foreground: '#aba',
    foodValue: 825,
    consumptions: 1,
    description: "Looks like someone else on the team ended up down here as well. I can only hope they were dead before the scavengers started working on them...",
    mixins: [Game.ItemMixins.Edible]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('spore-y mass', {
    name: 'spore-y mass',
    group: 'fungus corpse',
    supergroup: 'corpse',
    character: '@',
    invWeight: 150,
    invBulk: 300,
    foreground: 'grey',
    description: "a pod-like thing full of a greenish-grey powder and goo",
    seedTargets: ['corpse'],
    seedExclusions: ['fungus corpse'],
    growthLiklihoodGood: .23,
    seedGoodResult: 'docile fungus',
    seedBadResult: 'stunted fungus',
    mixins: [Game.ItemMixins.Seeder]
}, {
    disableRandomCreation: true
});


// ----------------------------------------------

// minerals

Game.ItemRepository.define('rock', {
    name: 'rock',
    group: 'mineral',
    character: Game.ItemRepository.Symbol['mineral'],
    invWeight: 2500,
    invBulk: 1150,
    description: "a good sized chunk of stone - you could throw it at something, but it's large enough that it'd be a bit awkward doing so.",
    foreground: 'lightGrey',
    attackValue: 1,
    rangedAttackDamageBonus: 2,
    isWeapon: true,
    craftingGroup: 'structure',
    craftingQuality: '1',
    craftingToolGroup: 'whacker',
    craftingToolQuality: '2',
    mixins: [Game.ItemMixins.Ammo, Game.ItemMixins.CraftingIngredient, Game.ItemMixins.CraftingTool]
});

Game.ItemRepository.define('lodestone', {
    name: 'lodestone',
    group: 'mineral',
    character: Game.ItemRepository.Symbol['mineral'],
    invWeight: 20500,
    invBulk: 1150,
    description: "a good sized chunk of surprisingly heavy stone.",
    foreground: 'blue'
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('iron nugget', {
    name: 'iron nugget',
    group: 'mineral',
    character: Game.ItemRepository.Symbol['mineral'],
    invWeight: 4785,
    invBulk: 975,
    foreground: '#ca9',
    description: "A large mass of iron, with various obvious impurities. Not much use... in it's current state."
});


// ----------------------------------------------

// specialized ammo

Game.ItemRepository.define('stone shot', {
    name: 'stone shot',
    group: 'shot',
    character: Game.ItemRepository.Symbol['ammo'],
    invWeight: 60,
    invBulk: 16,
    foreground: '#bbb',
    description: "A small-ish, rounded piece of dense stone. Perhaps intentionally shaped?",
    rangedAttackDamageBonus: 2,
    reuseChance: .35,
    mixins: [Game.ItemMixins.Ammo]
});

Game.ItemRepository.define('iron shot', {
    name: 'iron shot',
    group: 'shot',
    character: Game.ItemRepository.Symbol['ammo'],
    invWeight: 85,
    invBulk: 10,
    foreground: '#dcb',
    description: "A large pellet of iron - slightly rusted, but aerodynamically sound",
    rangedAttackDamageBonus: 5,
    reuseChance: .55,
    mixins: [Game.ItemMixins.Ammo]
});

Game.ItemRepository.define('lead shot', {
    name: 'lead shot',
    group: 'shot',
    character: Game.ItemRepository.Symbol['ammo'],
    invWeight: 115,
    invBulk: 10,
    foreground: '#ccd',
    description: "A rounded slug of lead",
    rangedAttackDamageBonus: 8,
    reuseChance: .25,
    mixins: [Game.ItemMixins.Ammo]
});

// ----------------------------------------------

// ammo launchers

Game.ItemRepository.define('sling', {
    name: 'sling',
    group: 'shooter',
    character: Game.ItemRepository.Symbol['shooter'],
    invWeight: 100,
    invBulk: 250,
    foreground: 'lightGrey',
    description: "A few feet of strong cord with a pocket in the middle to hold some ammo",
    rangedAttackDamageAdder: 3,
    rangedAttackDamageMultipler: 1.5,
    allowedAmmo: ['shot'],
    isWeapon: true,
    mixins: [Game.ItemMixins.Shooter]
});

Game.ItemRepository.define('sling staff', {
    name: 'sling staff',
    group: 'shooter',
    character: Game.ItemRepository.Symbol['shooter'],
    invWeight: 950,
    invBulk: 6500,
    foreground: 'yellow',
    description: "A staff-like device with a with a large pocket attached to one end by a length of strong cord. Too awkward for small shot, but effective with larger ammo.",
    rangedAttackDamageAdder: 5,
    rangedAttackDamageMultipler: 1.25,
    allowedAmmo: ['rock'],
    isWeapon: true,
    mixins: [Game.ItemMixins.Shooter]
});

// ----------------------------------------------

// Weapons
Game.ItemRepository.define('JAT tool, damaged', {
    name: 'JAT tool, damaged',
    character: Game.ItemRepository.Symbol['polearm'],
    invWeight: 1650,
    invBulk: 4100,
    foreground: 'gray',
    attackValue: 1,
    digAdder: 1,
    digMultiplier: .75,
    isWeapon: true,
//    isDigTool: true,
    description: "The JAT (Jack-of-All-Trades) tool is the standard-issue tool for work on Mars. While not as good as a specialized tool, it's at least moderately effective as a shovel, prybar, pick, axe, and walking stick for navigating rough terrain. Unfortunately this one has been badly damaged, but you could still probably hit something with it if you had to.",
    craftingToolGroup: 'cutter',
    craftingToolQuality: '2',
    mixins: [Game.ItemMixins.DigTool, Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

// Weapons
Game.ItemRepository.define('JAT tool, patched', {
    name: 'JAT tool, patched',
    character: Game.ItemRepository.Symbol['polearm'],
    invWeight: 1650,
    invBulk: 4100,
    foreground: 'gray',
    attackValue: 2,
    digAdder: 3,
    digMultiplier: 1,
    isWeapon: true,
//    isDigTool: true,
//    isCraftTool: true,
    description: "The JAT (Jack-of-All-Trades) tool is the standard-issue tool for work on Mars. While not as good as a specialized tool, it's at least moderately effective as a shovel, prybar, pick, axe, and walking stick for navigating rough terrain. This one was badly damaged, but subsequently somewhat repaired in a makeshift kind of way.",
    craftingToolGroup: 'cutter',
    craftingToolQuality: '3',
    mixins: [Game.ItemMixins.DigTool, Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('JAT tool', {
    name: 'JAT tool',
    character: Game.ItemRepository.Symbol['polearm'],
    invWeight: 1950,
    invBulk: 4400,
    foreground: '#bbf',
    attackValue: 6,
    defenseValue: 1,
    digAdder: 3,
    digMultiplier: 2.5,
    isWeapon: true,
//    isDigTool: true,
//    isCraftTool: true,
    description: "The JAT (Jack-of-All-Trades) tool is the standard-issue tool for work on Mars. While not as good as a specialized tool, it's at least moderately effective as a shovel, prybar, pick, axe, and walking stick for navigating rough terrain. Plus, if you have to you can use it to give something a pretty solid whack.",
    craftingToolGroup: 'cutter',
    craftingToolQuality: '3',
    mixins: [Game.ItemMixins.DigTool, Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('shard blade', {
    name: 'shard blade',
    character: Game.ItemRepository.Symbol['blade'],
    invWeight: 550,
    invBulk: 1100,
    foreground: 'white',
    attackValue: 4,
    isWeapon: true,
    description: "A large, sharp piece of volcanic glass has been shaped and affixed to a handle made of bone. Primitive, but effective.",
    craftingToolGroup: 'cutter',
    craftingToolQuality: '3',
    mixins: [Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('stone sword', {
    name: 'stone sword',
    character: Game.ItemRepository.Symbol['blade'],
    invWeight: 1700,
    invBulk: 3500,
    foreground: 'white',
    attackValue: 8,
    isWeapon: true,
    description: "A long piece of something like wood has been embedded with carefully shaped and fit pieces of dark glass. Primitive, but very effective.",
    craftingToolGroup: 'cutter',
    craftingToolQuality: '3',
    mixins: [Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('staff', {
    name: 'staff',
    character: Game.ItemRepository.Symbol['polearm'],
    invWeight: 1100,
    invBulk: 6000,
    foreground: 'yellow',
    attackValue: 1,
    defenseValue: 3,
    digAdder: 0,
    digMultiplier: 1.25,
    isWeapon: true,
//    isDigTool: true,
    description: "Someone - maybe another quake survivor? - has crafted a long fairly thin piece of something that resembles wood, with wrappings where the hands are to be placed. It's light weight and flex makes it more of a defensive weapon.",
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.DigTool,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('shod staff', {
    name: 'shod staff',
    character: Game.ItemRepository.Symbol['polearm'],
    invWeight: 1750,
    invBulk: 6200,
    foreground: 'yellow',
    attackValue: 4,
    defenseValue: 2,
    digAdder: 1,
    digMultiplier: 1.75,
    isWeapon: true,
//    isDigTool: true,
    description: "A long heavy piece of something that resembles wood. Parts of it are also wrapped in some kind of metal. It's heavy, but well balanced.",
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.DigTool,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

// ----------------------------------------------

// Wearables
Game.ItemRepository.define('HEM suit, damaged', {
    name: 'HEM suit, damaged',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 16850,
    invBulk: 11700,
    foreground: 'white',
    defenseValue: 1,
    wearable: true,
    isArmor: true,
    description: "The HEM (Hostile Environment Mitigation) suit is the standard outfit for those working on the surface. It would offer significant protection from scrapes and falls in addition to temperature controls, air supply, comm unit, etc. Sadly, this one has been very badly damaged and so provides only minimal protection. All the complicated systems have also been destroyed."
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('HEM suit, patched', {
    name: 'HEM suit, patched',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 17925,
    invBulk: 11900,
    foreground: 'white',
    defenseValue: 3,
    wearable: true,
    isArmor: true,
    description: "The HEM (Hostile Environment Mitigation) suit is the standard outfit for those working on the surface. It would offer significant protection from scrapes and falls in addition to temperature controls, air supply, comm unit, etc. This one has been very badly damaged and then had some make-shift repairs done to it. It provides some basic protection, but all the complicated systems are still broken."
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('leather armor', {
    name: 'leather armor',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 14900,
    invBulk: 16900,
    foreground: 'yellow',
    defenseValue: 2,
    wearable: true,
    isArmor: true,
    description: "Some kind of primitive armor made from leather (or whatever the local equivalent is). It doesn't exactly fit, but you could arrange it to cover some of your more vulnerable areas."
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('plated leather armor', {
    name: 'plated leather armor',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 18700,
    invBulk: 19000,
    foreground: 'orange',
    defenseValue: 4,
    wearable: true,
    isArmor: true,
    description: "Some kind of primitive armor made from leather (or whatever the local equivalent is), with hard, rocky plates affixed all over it. It's surprisingly effective for such low-tech work."
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('HEM suit', {
    name: 'HEM suit',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 18100,
    invBulk: 13000,
    foreground: 'white',
    defenseValue: 6,
    digAdder: 1,
    wearable: true,
    isArmor: true,
    description: "The HEM (Hostile Environment Mitigation) suit is the standard outfit for those working on the surface. It offers significant protection from scrapes and falls in addition to temperature controls, air supply, comm unit, etc.",
    mixins: [Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('HEM-A suit, damaged', {
    name: 'HEM-A suit, damaged',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 22400,
    invBulk: 18000,
    foreground: '#8ad',
    defenseValue: 5,
    digAdder: .5,
    wearable: true,
    isArmor: true,
    description: "The HEM-A (Hostile Environment Mitigation - Armored) suit is the heavy duty version of the standard HEM suit, designed for work in particularly hazardous environments. It has additional padding, plus Cera-tek composite plates embedded to help protect especially vulnerable areas. It also has the standard temperature controls, air supply, comm unit, etc. Sadly, this one has been very badly damaged and so provides much less protection than it otherwise would, and all the complicated systems have also been destroyed.",
    mixins: [Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('HEM-A suit, patched', {
    name: 'HEM-A suit, patched',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 25400,
    invBulk: 19000,
    foreground: '#8ad',
    defenseValue: 8,
    digAdder: 1,
    wearable: true,
    isArmor: true,
    description: "The HEM-A (Hostile Environment Mitigation - Armored) suit is the heavy duty version of the standard HEM suit, designed for work in particularly hazardous environments. It has additional padding, plus Cera-tek composite plates embedded to help protect especially vulnerable areas. It also has the standard temperature controls, air supply, comm unit, etc. This one has been very badly damaged and then partially patched up to give a bit more protection, though all the complicated systems have also been destroyed.",
    mixins: [Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('HEM-A suit', {
    name: 'HEM-A suit',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 24400,
    invBulk: 17000,
    foreground: '#8ad',
    defenseValue: 11,
    digAdder: 2,
    wearable: true,
    isArmor: true,
    description: "The HEM-A (Hostile Environment Mitigation - Armored) suit is the heavy duty version of the standard HEM suit, designed for work in particularly hazardous environments. It has additional padding, plus Cera-tek composite plates embedded to help protect especially vulnerable areas. It also has the standard temperature controls, air supply, comm unit, etc.",
    mixins: [Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

// ----------------------------------------------

// Containers

Game.ItemRepository.define('sack', {
    name: 'sack',
    group: 'container',
    character: Game.ItemRepository.Symbol['container'],
    invWeight: 650,
    invBulk: 3200,
    foreground: '#a84',
    description: "a medium-sized bag that can make it easier to carry things that aren't too large",
    maxCarryWeight: 18000,
    maxCarryBulk: 12000,
    accessDuration: 3500, // how long it takes to get something out of or put something in this container
    mixins: [Game.ItemMixins.Container]
}
//,{
//    disableRandomCreation: true
//}
);


Game.ItemRepository.define('shoulder-strap', {
    name: 'shoulder-strap',
    group: 'container',
    character: Game.ItemRepository.Symbol['container'],
    invWeight: 250,
    invBulk: 350,
    foreground: '#ba7',
    description: "a padded strap to carry a single, quickly accessible item",
    maxCarryWeight: 90000,
    maxCarryBulk: 120000,
    maxCarryQuantity: 1,
    accessDuration: 6500, // how long it takes to put something in this container
    accessDurationUnpack: 50, // how long it takes to get something out
    mixins: [Game.ItemMixins.Container]
}
//, {
//    disableRandomCreation: true
//}
);

Game.ItemRepository.define('bandolier', {
    name: 'bandolier',
    group: 'container',
    character: Game.ItemRepository.Symbol['container'],
    invWeight: 350,
    invBulk: 450,
    foreground: '#ba4',
    description: "a padded strap covered with small pockets and loops",
    maxCarryWeight: 2400,
    maxCarryBulk: 2400,
    maxCarryQuantity: 24,
    accessDuration: 600, // how long it takes to put something in this container
    accessDurationUnpack: 1, // how long it takes to get something out
    carryTypes: ['shot'],
    mixins: [Game.ItemMixins.Container]
}, {
    disableRandomCreation: true
});


Game.ItemRepository.define('knapsack', {
    name: 'knapsack',
    group: 'container',
    character: Game.ItemRepository.Symbol['container'],
    invWeight: 1650,
    invBulk: 600,
    foreground: '#cb6',
    description: "a heavy-duty container with some structure to it, and shoulder and hip straps to make carrying it (and its contents) MUCH easier. However, getting things into and out of it quite slow.",
    maxCarryWeight: 32000,
    maxCarryBulk: 20000,
    accessDuration: 8500, // how long it takes to get something out of or put something in this container
    mixins: [Game.ItemMixins.Container]
} ,{
    disableRandomCreation: true
});

Game.ItemRepository.define('belt-sheath', {
    name: 'belt-sheath',
    group: 'container',
    character: Game.ItemRepository.Symbol['container'],
    invWeight: 450,
    invBulk: 450,
    foreground: '#983',
    description: "an adjustable looped belt system for easily carrying and rapidly accessing a blade of most any size",
    maxCarryWeight: 3200,
    maxCarryBulk: 8000,
    maxCarryQuantity: 1,
    accessDuration: 300, // how long it takes to get something out of or put something in this container
    accessDurationUnpack: 100, // how long it takes to get something out
    carryTypes: ['blade'],
    mixins: [Game.ItemMixins.Container]
} ,{
    disableRandomCreation: true
});

// ----------------------------------------------

// crafting ingredients


Game.ItemRepository.define('dried mycelium sheet', {
    name: 'dried mycelium sheet',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#bb8',
    invWeight: 325,
    invBulk: 300,
    craftingGroup: 'material',
    craftingQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('leather piece', {
    name: 'leather piece',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#cb6',
    invWeight: 625,
    invBulk: 300,
    craftingGroup: 'material',
    craftingQuality: '2',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('cured leather piece', {
    name: 'cured leather piece',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#cb6',
    invWeight: 565,
    invBulk: 300,
    craftingGroup: 'material',
    craftingQuality: '3',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('cured mycelium sheet', {
    name: 'cured mycelium sheet',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#bb8',
    invWeight: 305,
    invBulk: 300,
    craftingGroup: 'material',
    craftingQuality: '3',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('kevlar weave', {
    name: 'kevlar weave',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#447',
    invWeight: 155,
    invBulk: 125,
    craftingGroup: 'material',
    craftingQuality: '4',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('bucky-mail sheet', {
    name: 'bucky-mail sheet',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#dde',
    invWeight: 745,
    invBulk: 380,
    craftingGroup: 'material',
    craftingQuality: '5',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

// ------------

Game.ItemRepository.define('jaw piece', {
    name: 'jaw piece',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#cdd',
    invWeight: 225,
    invBulk: 170,
    craftingGroup: 'edge',
    craftingQuality: '1',
    craftingToolGroup: 'cutter',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('stone shard', {
    name: 'stone shard',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#b99',
    invWeight: 195,
    invBulk: 140,
    craftingGroup: 'edge',
    craftingQuality: '2',
    craftingToolGroup: 'cutter',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});



Game.ItemRepository.define('obsidian shard', {
    name: 'obsidian shard',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#cdd',
    invWeight: 185,
    invBulk: 140,
    craftingGroup: 'edge',
    craftingQuality: '3',
    craftingToolGroup: 'cutter',
    craftingToolQuality: '2',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('iron blade', {
    name: 'iron blade',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#956',
    invWeight: 285,
    invBulk: 140,
    craftingGroup: 'edge',
    craftingQuality: '4',
    craftingToolGroup: 'cutter',
    craftingToolQuality: '3',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('JAT piece - edge', {
    name: 'JAT scrap - edge',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#6bc',
    invWeight: 205,
    invBulk: 200,
    craftingGroup: 'edge',
    craftingQuality: '6',
    craftingToolGroup: 'cutter',
    craftingToolQuality: '4',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

// ------------


Game.ItemRepository.define('cured mycelium - pole', {
    name: 'cured mycelium - pole',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#cc9',
    invWeight: 2115,
    invBulk: 2000,
    craftingGroup: 'pole',
    craftingQuality: '1',
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});


Game.ItemRepository.define('long chitin segment', {
    name: 'long chitin segment',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#ca7',
    invWeight: 3550,
    invBulk: 2000,
    craftingGroup: 'pole',
    craftingQuality: '3',
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('JAT piece - pole', {
    name: 'JAT piece - edge',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#6bc',
    invWeight: 1625,
    invBulk: 2000,
    craftingGroup: 'pole',
    craftingQuality: '5',
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

// ------------

Game.ItemRepository.define('dried mycelium - stick', {
    name: 'dried mycelium - stick',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#bb8',
    invWeight: 550,
    invBulk: 330,
    craftingGroup: 'stick',
    craftingQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('cured mycelium - stick', {
    name: 'cured mycelium - stick',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#cc9',
    invWeight: 480,
    invBulk: 330,
    craftingGroup: 'stick',
    craftingQuality: '2',
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('short chitin segment', {
    name: 'long chitin segment',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#ca7',
    invWeight: 510,
    invBulk: 330,
    craftingGroup: 'stick',
    craftingQuality: '3',
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('bone', {
    name: 'long bone',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#c89',
    invWeight: 765,
    invBulk: 330,
    craftingGroup: 'stick',
    craftingQuality: '4',
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('iron rod', {
    name: 'iron rod',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#956',
    invWeight: 1165,
    invBulk: 330,
    craftingGroup: 'stick',
    craftingQuality: '5',
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('JAT piece - stick', {
    name: 'JAT scrap - edge',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#6bc',
    invWeight: 625,
    invBulk: 330,
    craftingGroup: 'stick',
    craftingQuality: '6',
    craftingToolGroup: 'bracer',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

// ------------

Game.ItemRepository.define('dried mycelium - plate', {
    name: 'dried mycelium - plate',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#bb8',
    invWeight: 1740,
    invBulk: 730,
    craftingGroup: 'plate',
    craftingQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('cured mycelium - plate', {
    name: 'cured mycelium - plate',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#cc9',
    invWeight: 1885,
    invBulk: 730,
    craftingGroup: 'plate',
    craftingQuality: '2',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('scute', {
    name: 'scute',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#ca7',
    invWeight: 2375,
    invBulk: 730,
    craftingGroup: 'plate',
    craftingQuality: '3',
    craftingToolGroup: 'worksurface',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('iron plate', {
    name: 'iron plate',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#ca7',
    invWeight: 3375,
    invBulk: 730,
    craftingGroup: 'plate',
    craftingQuality: '5',
    craftingToolGroup: 'worksurface',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('metallo-ceramic plate', {
    name: 'metallo-ceramic plate',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#dde',
    invWeight: 2050,
    invBulk: 730,
    craftingGroup: 'plate',
    craftingQuality: '7',
    craftingToolGroup: 'worksurface',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

// ------------

Game.ItemRepository.define('mycelial fiber', {
    name: 'mycelial fiber',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#b99',
    invWeight: 45,
    invBulk: 60,
    craftingGroup: 'cord',
    craftingQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('leather strip', {
    name: 'leather strip',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#b99',
    invWeight: 50,
    invBulk: 105,
    craftingGroup: 'cord',
    craftingQuality: '2',
    craftingToolGroup: 'holder',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('cured mycelial fiber', {
    name: 'cured mycelial fiber',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#b99',
    invWeight: 30,
    invBulk: 40,
    craftingGroup: 'cord',
    craftingQuality: '3',
    craftingToolGroup: 'holder',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('sinew', {
    name: 'sinew',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#b99',
    invWeight: 50,
    invBulk: 105,
    craftingGroup: 'cord',
    craftingQuality: '4',
    craftingToolGroup: 'holder',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('kevlar-carbon thread', {
    name: 'kevlar-carbon thread',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#b99',
    invWeight: 10,
    invBulk: 25,
    craftingGroup: 'cord',
    craftingQuality: '6',
    craftingToolGroup: 'holder',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

// ------------

Game.ItemRepository.define('starch paste', {
    name: 'starch paste',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#bb9',
    invWeight: 10,
    invBulk: 25,
    craftingGroup: 'binder',
    craftingQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('pitch', {
    name: 'pitch',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#bb9',
    invWeight: 10,
    invBulk: 25,
    craftingGroup: 'binder',
    craftingQuality: '2',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('protein glue', {
    name: 'protein glue',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#bb9',
    invWeight: 10,
    invBulk: 25,
    craftingGroup: 'binder',
    craftingQuality: '3',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('epoxy', {
    name: 'epoxy',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#bb9',
    invWeight: 10,
    invBulk: 25,
    craftingGroup: 'binder',
    craftingQuality: '5',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('nano-cement', {
    name: 'nano-cement',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#bb9',
    invWeight: 10,
    invBulk: 25,
    craftingGroup: 'binder',
    craftingQuality: '7',
    mixins: [Game.ItemMixins.CraftingIngredient]
}, {
    disableRandomCreation: true
});

// ------------

Game.ItemRepository.define('worked stone', {
    name: 'worked stone',
    group: 'crafting ingredient',
    character: Game.ItemRepository.Symbol['crafting ingredient'],
    description: "",
    foreground: '#b99',
    invWeight: 10,
    invBulk: 25,
    craftingGroup: 'structure',
    craftingQuality: '3',
    craftingToolGroup: 'whacker',
    craftingToolQuality: '1',
    mixins: [Game.ItemMixins.CraftingIngredient,Game.ItemMixins.CraftingTool]
}, {
    disableRandomCreation: true
});

// ------------