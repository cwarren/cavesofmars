// Player template
Game.PlayerTemplate = {
    name: 'player',
    character: '@',
    foreground: 'white',
    background: 'black',
    maxHp: 30,
    attackValue: 3,
    sightRadius: 4,
    inventorySlots: 22,
    statPointsPerLevel: 2,
//    fullness: 1000,
    mixins: [Game.EntityMixins.PlayerActor, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.MessageRecipient, 
             Game.EntityMixins.FoodConsumer, Game.EntityMixins.InventoryHolder, Game.EntityMixins.Seer, Game.EntityMixins.Digger,
             Game.EntityMixins.Equipper, Game.EntityMixins.ExperienceGainer, Game.EntityMixins.PlayerStatGainer]
}

////////////////////////////////////////////////////////////////

// Create our central entity repository
Game.EntityRepository = new Game.Repository('entities', Game.Entity);

Game.EntityRepository.define('fruiting fungus', {
    name: 'fruiting fungus',
    group: 'fungus',
    character: '%',
    foreground: 'brown',
    maxHp: 15,
    corpseName: 'pile of mushroom caps',
    corpseFoodValue: 10,
    suicideSpawnEntityName: 'quiescent fungus',
    mixins: [Game.EntityMixins.FruitingFungusActor, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.SuicideSpawner]
});

Game.EntityRepository.define('spreading fungus', {
    name: 'spreading fungus',
    group: 'fungus',
    character: '%',
    foreground: 'pink',
    attackValue: 4,
    defenseValue: 1,
    maxHp: 25,
    corpseName: 'spore-y mass',
    corpseFoodValue: 1,
    defaultActionDuration: 1250,
    suicideSpawnEntityName: 'fruiting fungus',
    allies: ['fungus'],
    mixins: [Game.EntityMixins.SpreadingFungusActor, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.Allier, Game.EntityMixins.SuicideSpawner]
});


Game.EntityRepository.define('quiescent fungus', {
    name: 'quiescent fungus',
    group: 'fungus',
    character: '%',
    foreground: 'grey',
    maxHp: 5,
    corpseName: 'spore-y mass',
    corpseFoodValue: 1,
    mixins: [Game.EntityMixins.Destructible,Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('fungus zombie', {
    name: 'fungus zombie',
    group: 'fungus',
    character: 'z',
    foreground: 'pink',
    attackValue: 5,
    defenseValue: 3,
    maxHp: 18,
    sightRadius: 3,
    corpseName: 'spore-y mass',
    corpseFoodValue: 1,
    suicideSpawnEntityName: 'spreading fungus',
    defaultActionDuration: 1750,
    baseBehavior: Game.EntityBehaviors.AggressiveWanderBehavior,
    allies: ['fungus'],
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.Allier, 
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.Seer, Game.EntityMixins.SuicideSpawner, Game.EntityMixins.AutoDegrader, Game.EntityMixins.Suicider]
});

Game.EntityRepository.define('bat', {
    name: 'bat',
    character: 'b',
    foreground: 'blue',
    maxHp: 5,
    corpseFoodValue: 15,
    moveDuration: 500,
    mixins: [Game.EntityMixins.PeacefulRoamingBehaviorController, Game.EntityMixins.Destructible,Game.EntityMixins.CorpseDropper]
});

Game.EntityRepository.define('newt', {
    name: 'giant newt',
    character: 'l',
    foreground: 'yellow',
    maxHp: 7,
    attackValue: 4,
    defenseValue: 1,
    corpseFoodValue: 65,
    baseBehavior: Game.EntityBehaviors.AggressiveWanderBehavior,
    behaviors: [Game.EntityBehaviors.AggressiveWanderBehavior],
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.Retaliator,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer]
});

Game.EntityRepository.define('rock lizard', {
    name: 'rock lizard',
    character: 'l',
    foreground: 'goldenrod',
    maxHp: 4,
    attackValue: 2,
    defenseValue: 5,
    corpseFoodValue: 25,
    defaultActionDuration: 1350,
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.Digger,Game.EntityMixins.CorpseDropper,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer]
});

Game.EntityRepository.define('snake', {
    name: 'snake',
    character: 's',
    foreground: 'green',
    maxHp: 9,
    attackValue: 3,
    corpseFoodValue: 20,
    moveDuration: 350,
    meleeDuration: 3800,
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.Seer, Game.EntityMixins.CorpseDropper,
             Game.EntityMixins.Retaliator, Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer]
});


Game.EntityRepository.define('ooze', {
    name: 'ooze',
    character: 'o',
    foreground: 'lightGreen',
    maxHp: 10,
    attackValue: 5,
    sightRadius: 2,
    allies: ['giant zombie','ooze'],
    baseBehavior: Game.EntityBehaviors.AggressiveWanderBehavior,
    behaviors: [Game.EntityBehaviors.AggressiveWanderBehavior],
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.Seer,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.Allier]
});

Game.EntityRepository.define('giant zombie', {
    name: 'giant zombie', 
    character: 'Z',
    foreground: 'teal',
    maxHp: 30,
    attackValue: 8,
    defenseValue: 5,
    level: 5,
    sightRadius: 6,
    moveDuration: 1100,
    meleeDuration: 900,
    allies: ['ooze'],
    baseBehavior: Game.EntityBehaviors.AggressiveWanderBehavior,
    behaviors: [Game.EntityBehaviors.AggressiveWanderBehavior],
    mixins: [Game.EntityMixins.GiantZombieActor, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.Seer, 
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.Allier]
}, {
    disableRandomCreation: true
});
