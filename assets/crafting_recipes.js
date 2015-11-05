Game.RecipeRepository = new Game.Repository('recipes', Game.Item);

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

/*

HOW RECIPES / CRAFTING WORK (conceptual):
    * ingredients are used up regardless of crafting success or failure
    * tools and structures are not used up (usually)
    * ingredients and tools are kept in inventory
    * structures are on the map - player must be adjacent to or co-located with structures to be used for crafting


As a general rule, recipes with a lower success rate should have a shorter duration, and recipes with a guaranteed success should have a duration at least 2x normal.

As a general rule, recipes that produce better things should:
    - have more and more stringent ingredients
    - require special tools and / or structures
    - have some sort of crafting chain / pyramid below them
    - take longer
    - NOT be less likely to succeed (and actually usually have high or even guaranteed success)
    - may have quality-based enhancements (once that part of the game is implemented)

As a general rule, recipes that form the bottom of pyramids / chains:
    - use common, easy ingredients
    - have minimal tool and/or structure needs
    - are relatively short duration
    - may have low success rates
    - don't care about quality beyond certain minimal standards; no quality-based enhancements on results

*/

Game.RecipeRepository.define('sling', {
    name: 'sling',
    group: 'crafting recipe',
    description: "a simple sling - primitive, but effective",
    recipeType: 'compose',
    craftingIngredients: {'G:cord~2': 2, 'G:material~2': 1},
    craftingTools: {'G:cutter~2':1},
    craftingSuccessChance: '.9',
    craftingDuration: 16000,
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
    craftingDuration: 6000,
    craftingSuccessChance: '.4',
    craftingOutcomeObject: 'worked stone',
    mixins: [Game.ItemMixins.CraftingRecipe]
});

Game.RecipeRepository.define('stone hammer', {
    name: 'stone hammer',
    group: 'crafting recipe',
    description: "a carefully shaped piece of strong stone attached to a handle",
    recipeType: 'compose',
    craftingIngredients: {'worked stone': 1,'G:cord~2':1,'G:binder~2':1,'G:stick~3':1},
    craftingTools: {'G:bracer~1':1},
    craftingSuccessChance: '.85',
    craftingOutcomeObject: 'stone hammer',
    mixins: [Game.ItemMixins.CraftingRecipe]
});

Game.RecipeRepository.define('stone shot', {
    name: 'stone shot',
    group: 'crafting recipe',
    description: "sling ammunition",
    recipeType: 'compose',
    craftingIngredients: {'worked stone': 1},
    craftingTools: {'G:whacker~2': 1},
    craftingSuccessChance: '.7',
    craftingDuration: 9000,
    craftingSuccessCountTable: [1,1,1,2,2],
    craftingOutcomeObject: 'stone shot',
    mixins: [Game.ItemMixins.CraftingRecipe]
});

Game.RecipeRepository.define('iron shot', {
    name: 'iron shot',
    group: 'crafting recipe',
    description: "more effective sling ammunition",
    recipeType: 'compose',
    craftingIngredients: {'iron nugget': 1},
    craftingTools: {'G:whacker~3':1,'G:worksurface~5':1},
    craftingSuccessChance: '.9',
    craftingDuration: 10000,
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
    craftingDuration: 25000,
    craftingSuccessChance: '.6',
    craftingOutcomeObject: 'shard blade',
    mixins: [Game.ItemMixins.CraftingRecipe]
});
