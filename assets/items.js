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
'mineral': String.fromCharCode(164) // 164 currency symbol 
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
    foodValue: 35,
    consumptions: 4,
    description: "This reminds you of a cross between a coconut and a geode. When you open it up the inside is filled with a soft greyish material that tastes bland and feels a bit chalky, but at least it's apparently nutritious.",
    rangedAttackDamageBonus: 6,
    mixins: [Game.ItemMixins.Edible,Game.ItemMixins.Ammo]
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
    foodValue: 125,
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
    character: Game.ItemRepository.Symbol['mineral'],
    invWeight: 2500,
    invBulk: 1150,
    description: "a good sized chunk of stone - you could throw it at something, but it's large enough that it'd be a bit awkward doing so.",
    foreground: 'lightGrey',
    attackValue: 1,
    rangedAttackDamageBonus: 2,
    mixins: [Game.ItemMixins.Ammo]
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
    rangedAttackDamageBonus: 1,
    reuseChance: .3,
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
    rangedAttackDamageBonus: 4,
    reuseChance: .6,
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
    wieldable: true,
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
    attackValue: 2,
    digAdder: 3,
    digMultiplier: .75,
    wieldable: true,
    description: "The JAT (Jack-of-All-Trades) tool is the standard-issue tool for work on Mars. While not as good as a specialized tool, it's at least moderately effective as a shovel, prybar, pick, axe, and walking stick for navigating rough terrain. Unfortunately this one has been badly damaged, but you could still probably hit something with it if you had to.",
    mixins: [Game.ItemMixins.DigTool]
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
    wieldable: true,
    description: "The JAT (Jack-of-All-Trades) tool is the standard-issue tool for work on Mars. While not as good as a specialized tool, it's at least moderately effective as a shovel, prybar, pick, axe, and walking stick for navigating rough terrain. Plus, if you have to you can use it to give something a pretty solid whack.",
    mixins: [Game.ItemMixins.DigTool]
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
    wieldable: true,
    description: "A large, sharp piece of volcanic glass has been shaped and affixed to a handle made of bone. Primitive, but effective.",
    mixins: []
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('stone sword', {
    name: 'stone sword',
    character: Game.ItemRepository.Symbol['blade'],
    invWeight: 1700,
    invBulk: 3500,
    foreground: 'white',
    attackValue: 9,
    wieldable: true,
    description: "A long piece of something like wood has been embedded with carefully shaped and fit pieces of dark glass. Primitive, but very effective.",
    mixins: []
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
    wieldable: true,
    description: "A long fairly thin piece of something that resembles wood, with wrappings where the hands are to be placed. It's light weight and flex makes it more of a defensive tool.",
    mixins: [Game.ItemMixins.DigTool]
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
    wieldable: true,
    description: "A long heavy piece of something that resembles wood. Parts of it are also wrapped in some kind of metal. It's heavy, but well balanced.",
    mixins: [Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

// ----------------------------------------------

// Wearables
Game.ItemRepository.define('HEM suit, damaged', {
    name: 'HEM suit, damaged',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 6200,
    invBulk: 7700,
    foreground: 'grey',
    defenseValue: 1,
    wearable: true,
    description: "The HEM (Hostile Environment Mitigation) suit is the standard outfit for those working on the surface. It would offer significant protection from scrapes and falls in addition to temperature controls, air supply, comm unit, etc. Sadly, this one has been very badly damaged and so provides only minimal protection. All the complicated systems have also been destroyed.",
    mixins: [Game.ItemMixins.Wearable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('leather armor', {
    name: 'leather armor',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 11900,
    invBulk: 12900,
    foreground: 'yellow',
    defenseValue: 2,
    wearable: true,
    description: "Some kind of primitive armor made from leather (or whatever the local equivalent is). It doesn't exactly fit, but you could arrange it to cover some of your more vulnerable areas.",
    mixins: [Game.ItemMixins.Wearable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('plated leather armor', {
    name: 'plated leather armor',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 17700,
    invBulk: 19000,
    foreground: 'orange',
    defenseValue: 4,
    wearable: true,
    description: "Some kind of primitive armor made from leather (or whatever the local equivalent is), with hard, rocky plates affixed all over it. It's surprisingly effective for such low-tech work.",
    mixins: [Game.ItemMixins.Wearable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('HEM suit', {
    name: 'HEM suit',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 9100,
    invBulk: 9000,
    foreground: 'white',
    defenseValue: 6,
    digAdder: 1,
    wearable: true,
    description: "The HEM (Hostile Environment Mitigation) suit is the standard outfit for those working on the surface. It offers significant protection from scrapes and falls in addition to temperature controls, air supply, comm unit, etc.",
    mixins: [Game.ItemMixins.Wearable, Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('HEM-A suit', {
    name: 'HEM-A suit',
    character: Game.ItemRepository.Symbol['wearable'],
    invWeight: 11400,
    invBulk: 12000,
    foreground: '#8ad',
    defenseValue: 11,
    digAdder: 2,
    wearable: true,
    description: "The HEM-A (Hostile Environment Mitigation - Armored) suit is the heavy duty version of the standard HEM suit, designed for work in particularly hazardous environments. It has additional padding, plus Cera-tek composite plates embedded to help protect especially vulnerable areas. It also has the standard temperature controls, air supply, comm unit, etc.",
    mixins: [Game.ItemMixins.Wearable, Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});