Game.RecipeRepository = new Game.Repository('recipes', Game.Item);

/*
Game.RecipeRepository.define('breakdown', {
    name: 'BREAK DOWN',
    group: 'crafting recipe',
    description: "pieces that might be used for something else by breaking down an item",
    recipeType: 'decompose',
    successChance: '1',
    outcomeObject: 'ITEM_DEPENDENT',
    mixins: [Game.ItemMixins.CraftingRecipe]
});
*/

Game.RecipeRepository.define('BREAKDOWN', {
    name: 'BREAKDOWN',
    group: 'crafting recipe',
    description: "break an item down into parts",
    recipeType: 'decompose',
    craftingIngredients: "SEEITEM",
    craftingTools: "SEEITEM",
    craftingStructures: "SEEITEM",
    craftingSuccessChance: "SEEITEM",
    craftingOutcomeObject: "SEEITEM",
    mixins: [Game.ItemMixins.CraftingRecipe]
});



Game.RecipeRepository.define('sling', {
    name: 'sling',
    group: 'crafting recipe',
    description: "a simple sling - primitive, but effective",
    recipeType: 'compose',
    craftingIngredients: {'G:cord~2': 2, 'G:material~2': 1},
    craftingTools: {'G:cutter~2':1},
    craftingSuccessChance: '1',
    craftingOutcomeObject: 'sling',
    mixins: [Game.ItemMixins.CraftingRecipe]
});

Game.RecipeRepository.define('worked stone', {
    name: 'worked stone',
    group: 'crafting recipe',
    description: "a piece of stone shaped and worked to be more useful and with only the hardest, strongest parts remaining; only a few rocks end up being usable",
    recipeType: 'compose',
    craftingIngredients: {'rock': 1},
    craftingTools: {'G:whacker~1':1},
    craftingDuration: 20000,
    craftingSuccessChance: '.2',
    craftingOutcomeObject: 'worked stone',
    mixins: [Game.ItemMixins.CraftingRecipe]
});

Game.RecipeRepository.define('stone hammer', {
    name: 'stone hammer',
    group: 'crafting recipe',
    description: "a piece of stone shaped and worked to be more useful and with only the hardest, strongest parts remaining; only a few rocks end up being usable",
    recipeType: 'compose',
    craftingIngredients: {'worked stone': 1,'G:cord~2':1,'G:binder~2':1,'G:stick~3':1},
    craftingTools: {'G:bracer~1':1},
    craftingDuration: 20000,
    craftingSuccessChance: '.75',
    craftingOutcomeObject: 'stone hammer',
    mixins: [Game.ItemMixins.CraftingRecipe]
});


Game.RecipeRepository.define('iron shot', {
    name: 'iron shot',
    group: 'crafting recipe',
    description: "effective ammunition",
    recipeType: 'compose',
    craftingIngredients: {'iron nugget': 1},
    craftingTools: {'G:whacker~3':1,'G:worksurface~5':1},
    craftingSuccessChance: '.7',
    craftingSuccessCountTable: [1,1,1,1,2,3],
    craftingOutcomeObject: 'iron shot',
    mixins: [Game.ItemMixins.CraftingRecipe]
});


Game.RecipeRepository.define('shard blade', {
    name: 'shard blade',
    group: 'crafting recipe',
    description: "a basic knife",
    recipeType: 'compose',
    craftingIngredients: {'G:edge~2': 1, 'G:cord': 1, 'G:binder~2': 1, 'G:stick~3': 1},
    craftingTools: {'G:bracer':1,'G:holder':1},
    craftingSuccessChance: '.15',
    craftingOutcomeObject: 'shard blade',
    mixins: [Game.ItemMixins.CraftingRecipe]
});
