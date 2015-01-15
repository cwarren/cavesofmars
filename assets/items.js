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
Game.ItemRepository.define('apple', {
    name: 'apple',
    character: Game.ItemRepository.Symbol['food'],
    foreground: 'red',
    foodValue: 50,
    mixins: [Game.ItemMixins.Edible]
});

Game.ItemRepository.define('melon', {
    name: 'melon',
    character: Game.ItemRepository.Symbol['food'],
    foreground: 'lightGreen',
    foodValue: 35,
    consumptions: 4,
    mixins: [Game.ItemMixins.Edible]
});

Game.ItemRepository.define('corpse', {
    name: 'corpse',
    group: 'corpse',
    supergroup: 'corpse',
    character: String.fromCharCode(169), // copyright symbol
    foodValue: 5,
    consumptions: 1,
    mixins: [Game.ItemMixins.Edible]
}, {
    disableRandomCreation: true
});

// ----------------------------------------------

// minerals

Game.ItemRepository.define('rock', {
    name: 'rock',
    character: Game.ItemRepository.Symbol['mineral'],
    foreground: 'lightGrey'
});


// ----------------------------------------------

// Weapons
Game.ItemRepository.define('dagger', {
    name: 'dagger',
    character: Game.ItemRepository.Symbol['blade'],
    foreground: 'gray',
    attackValue: 5,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('sword', {
    name: 'sword',
    character: Game.ItemRepository.Symbol['blade'],
    foreground: 'white',
    attackValue: 10,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('staff', {
    name: 'staff',
    character: Game.ItemRepository.Symbol['polearm'],
    foreground: 'yellow',
    attackValue: 3,
    defenseValue: 3,
    wieldable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

// ----------------------------------------------

// Wearables
Game.ItemRepository.define('tunic', {
    name: 'tunic',
    character: Game.ItemRepository.Symbol['wearable'],
    foreground: 'green',
    defenseValue: 2,
    wearable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('chainmail', {
    name: 'chainmail',
    character: Game.ItemRepository.Symbol['wearable'],
    foreground: 'white',
    defenseValue: 4,
    wearable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});

Game.ItemRepository.define('platemail', {
    name: 'platemail',
    character: Game.ItemRepository.Symbol['wearable'],
    foreground: '#8ad',
    defenseValue: 7,
    wearable: true,
    mixins: [Game.ItemMixins.Equippable]
}, {
    disableRandomCreation: true
});