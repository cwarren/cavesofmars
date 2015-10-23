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
    successChance: "SEEITEM",
    outcomeObject: "SEEITEM",
    mixins: [Game.ItemMixins.CraftingRecipe]
});



Game.RecipeRepository.define('sling', {
    name: 'sling',
    group: 'crafting recipe',
    description: "a simple sling - primitive, but effective",
    recipeType: 'compose',
    craftingIngredients: {'G:cord~2': 2, 'G:material~2': 1},
    craftingTools: {'G:cutter~2':1},
    successChance: '1',
    outcomeObject: 'sling',
    mixins: [Game.ItemMixins.CraftingRecipe]
});


Game.RecipeRepository.define('shard blade', {
    name: 'shard blade',
    group: 'crafting recipe',
    description: "a basic knife",
    recipeType: 'compose',
    craftingIngredients: {'G:edge~2': 1, 'G:cord': 1, 'G:binder~2': 1, 'G:stick~3': 1},
    craftingTools: {'G:bracer':1,'G:holder':1},
    successChance: '.15',
    outcomeObject: 'shard blade',
    mixins: [Game.ItemMixins.CraftingRecipe]
});
