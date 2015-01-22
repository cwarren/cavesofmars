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
    character: Game.ItemRepository.Symbol['food'],
    foreground: 'red',
    foodValue: 50,
    description: "Fairly small, but dense. It's translucent and the outer surface seems pretty dry. The insides look like they're the consistency of jello. The air around it smells mildly acidic and a bit cinnamon-y. The anaylzer says it's not poisonous. Probably.",
    mixins: [Game.ItemMixins.Edible]
});

Game.ItemRepository.define('geodic nut', {
    name: 'geodic nut',
    character: Game.ItemRepository.Symbol['food'],
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
    foreground: 'grey',
    description: "a pod-like thing full of a greenish-grey powder and goo",
    seedTargets: ['corpse'],
    seedExclusions: ['fungus corpse'],
    growthLiklihoodGood: .23,
    seedGoodResult: 'docile fungus',
    seedBadResult: 'quiescent fungus',
    mixins: [Game.ItemMixins.Seeder]
}, {
    disableRandomCreation: true
});


// ----------------------------------------------

// minerals

Game.ItemRepository.define('rock', {
    name: 'rock',
    character: Game.ItemRepository.Symbol['mineral'],
    foreground: 'lightGrey',
    rangedAttackDamageBonus: 1,
    mixins: [Game.ItemMixins.Ammo]
});


// ----------------------------------------------

// specialized ammo

Game.ItemRepository.define('stone shot', {
    name: 'stone shot',
    group: 'shot',
    character: Game.ItemRepository.Symbol['ammo'],
    foreground: 'lightGrey',
    description: "a small-ish, rounded piece of dense stone. Perhaps intentionally shaped?",
    rangedAttackDamageBonus: 3,
    mixins: [Game.ItemMixins.Ammo]
});


// ----------------------------------------------

// Weapons
Game.ItemRepository.define('JAT tool, damaged', {
    name: 'JAT tool, damaged',
    character: Game.ItemRepository.Symbol['polearm'],
    foreground: 'gray',
    attackValue: 2,
    digAdder: 3,
    digMultiplier: .75,
    wieldable: true,
    description: "The JAT (Jack-of-All-Trades) tool is the standard-issue tool for work on Mars. While not as good as a specialized tool, it's at least moderately effective as a shovel, prybar, pick, axe, and walking stick for navigating rough terrain. Unfortunately this one has been badly damaged, but you could still probably hit something with it if you had to.",
    mixins: [Game.ItemMixins.Equippable, Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('JAT tool', {
    name: 'JAT tool',
    character: Game.ItemRepository.Symbol['polearm'],
    foreground: '#bbf',
    attackValue: 6,
    defenseValue: 1,
    digAdder: 3,
    digMultiplier: 2.5,
    wieldable: true,
    description: "The JAT (Jack-of-All-Trades) tool is the standard-issue tool for work on Mars. While not as good as a specialized tool, it's at least moderately effective as a shovel, prybar, pick, axe, and walking stick for navigating rough terrain. Plus, if you have to you can use it to give something a pretty solid whack.",
    mixins: [Game.ItemMixins.Equippable, Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('shard blade', {
    name: 'shard blade',
    character: Game.ItemRepository.Symbol['blade'],
    foreground: 'white',
    attackValue: 4,
    wieldable: true,
    description: "A large, sharp piece of volcanic glass has been shaped and affixed to a handle made of bone. Primitive, but effective.",
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('stone sword', {
    name: 'stone sword',
    character: Game.ItemRepository.Symbol['blade'],
    foreground: 'white',
    attackValue: 9,
    wieldable: true,
    description: "A long piece of something like wood has been embedded with carefully shaped and fit pieces of dark glass. Primitive, but very effective.",
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('staff', {
    name: 'staff',
    character: Game.ItemRepository.Symbol['polearm'],
    foreground: 'yellow',
    attackValue: 1,
    defenseValue: 3,
    digAdder: 0,
    digMultiplier: 1.25,
    wieldable: true,
    description: "A long fairly thin piece of something that resembles wood, with wrappings where the hands are to be placed. It's light weight and flex makes it more of a defensive tool.",
    mixins: [Game.ItemMixins.Equippable, Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('shod staff', {
    name: 'shod staff',
    character: Game.ItemRepository.Symbol['polearm'],
    foreground: 'yellow',
    attackValue: 4,
    defenseValue: 2,
    digAdder: 1,
    digMultiplier: 1.75,
    wieldable: true,
    description: "A long heavy piece of something that resembles wood. Parts of it are also wrapped in some kind of metal. It's heavy, but well balanced.",
    mixins: [Game.ItemMixins.Equippable, Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

// ----------------------------------------------

// Wearables
Game.ItemRepository.define('HEM suit, damaged', {
    name: 'HEM suit, damaged',
    character: Game.ItemRepository.Symbol['wearable'],
    foreground: 'grey',
    defenseValue: 1,
    wearable: true,
    description: "The HEM (Hostile Environment Mitigation) suit is the standard outfit for those working on the surface. It would offer significant protection from scrapes and falls in addition to temperature controls, air supply, comm unit, etc. Sadly, this one has been very badly damaged and so provides only minimal protection. All the complicated systems have also been destroyed.",
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('leather armor', {
    name: 'leather armor',
    character: Game.ItemRepository.Symbol['wearable'],
    foreground: 'yellow',
    defenseValue: 2,
    wearable: true,
    description: "Some kind of primitive armor made from leather (or whatever the local equivalent is). It doesn't exactly fit, but you could arrange it to cover some of your more vulnerable areas.",
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('plated leather armor', {
    name: 'plated leather armor',
    character: Game.ItemRepository.Symbol['wearable'],
    foreground: 'orange',
    defenseValue: 4,
    wearable: true,
    description: "Some kind of primitive armor made from leather (or whatever the local equivalent is), with hard, rocky plates affixed all over it. It's surprisingly effective for such low-tech work.",
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('HEM suit', {
    name: 'HEM suit',
    character: Game.ItemRepository.Symbol['wearable'],
    foreground: 'white',
    defenseValue: 6,
    digAdder: 1,
    wearable: true,
    description: "The HEM (Hostile Environment Mitigation) suit is the standard outfit for those working on the surface. It offers significant protection from scrapes and falls in addition to temperature controls, air supply, comm unit, etc.",
    mixins: [Game.ItemMixins.Equippable, Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('HEM-A suit', {
    name: 'HEM-A suit',
    character: Game.ItemRepository.Symbol['wearable'],
    foreground: '#8ad',
    defenseValue: 11,
    digAdder: 2,
    wearable: true,
    description: "The HEM-A (Hostile Environment Mitigation - Armored) suit is the heavy duty version of the standard HEM suit, designed for work in particularly hazardous environments. It has additional padding, plus Cera-tek composite plates embedded to help protect especially vulnerable areas. It also has the standard temperature controls, air supply, comm unit, etc.",
    mixins: [Game.ItemMixins.Equippable, Game.ItemMixins.DigTool]
}, {
    disableRandomCreation: true
});