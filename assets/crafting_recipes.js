Game.RecipeRepository = new Game.Repository('recipes', Game.Item);

Game.RecipeRepository.define('sling', {
    name: 'sling',
    group: 'crafting recipe',
    description: "make a  simple sling - primitive, but effective",
    recipeType: 'construct',
    ingredients: {'G:cord~2': 2, 'G:material~2': 1},
    resourceRequirements: {'G:edge~2':1},
    successChance: '.25',
    outcomeObject: 'sling',
    mixins: [Game.ItemMixins.CraftingRecipe]
});