Game.RecipeRepository = new Game.Repository('recipes', Game.Item);

Game.RecipeRepository.define('sling', {
    name: 'sling',
    group: 'crafting recipe',
    description: "make a  simple sling - primitive, but effective",
    recipeType: 'compose',
    craftingIngredients: {'G:cord~2': 2, 'G:material~2': 1},
    craftingTools: {'G:edge~2':1},
    successChance: '.25',
    outcomeObject: 'sling',
    mixins: [Game.ItemMixins.CraftingRecipe]
});