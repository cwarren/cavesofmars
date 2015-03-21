// Player template
Game.PlayerTemplate = {
    name: 'player',
    character: '@',
    description: "Yourself.",
    foreground: 'white',
    background: 'black',
    maxHp: 30,
    attackValue: 3,
    digRate: 2,
    sightRadius: 4,
    inventorySlots: 42,
    statPointsPerLevel: 2,
    messageArchiveLimit: 50,
//    fullness: 1000,
    allies: ['teammate'],
    mixins: [Game.EntityMixins.PlayerActor, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.RangedAttacker, Game.EntityMixins.MessageRecipient, 
             Game.EntityMixins.FoodConsumer, Game.EntityMixins.InventoryHolder, Game.EntityMixins.Seer, Game.EntityMixins.Digger,
             Game.EntityMixins.Equipper, Game.EntityMixins.ExperienceGainer, Game.EntityMixins.PlayerStatGainer, Game.EntityMixins.Allier,
             Game.EntityMixins.RadioUser, Game.EntityMixins.Destructible]
}


// Player template
Game.TeammateTemplate = {
    name: 'teammate',
    character: '@',
    description: "Your teammates all look the same in their HEM suits. Note to self: get them to add some kind of visual ID once we get back to base",
    foreground: '#ccc',
    background: 'black',
    allies: ['player'],
    babbleStrings: [
    'Min checking in',
    'Dari checking in',
    'Morgan checking in',
    'Nate checking in',
    'Amy checking in',
    'Lee checking in',
    'Maya checking in',
    'Ondras checking in',
    'Anyone seen Micah recently?',
    "I can't find Micah!",
    'Looks like some kind of hole over here',
    'zzzshshshstzk',
    'pshshsh shzzkkz jhshjh',
    '...kkkk..kzzzt..chkt...',
    'Wow! Check this out!',
    'Interesting formation over here',
    'Looks like some of the old flow is exposed in this area',
    'Watch out for those sand-filled areas - some of them are surprisingly deep!',
    "Ow! ...I'm OK",
    'Look at that view!',
    'Where is everyone?',
    'Anyone have an extra sample bag?',
    'This is Rover-14, how are you doing out there?',
    'I need an extra battery pack',
    "This isn't quite what I expected",
    'Huh - this is strange...',
    'I think this surface is not completely stable',
    'Whoa - watch it!',
    'Careful not to kick up too much powder',
    "We're number 1!",
    'too much static on this channel - switch to the next',
    'Wow! Check this out!',
    'Interesting formation over here',
    'Looks like some of the old flow is exposed in this area',
    'Watch out for those sand-filled areas - some of them are surprisingly deep!',
    "Ow! ...I'm OK",
    'Look at that view!',
    'Where is everyone?',
    'Anyone have an extra sample bag?',
    'This is Rover-14, how are you doing out there?',
    'I need an extra battery pack',
    "This isn't quite what I expected",
    'Huh - this is strange...',
    'I think this surface is not completely stable',
    'Whoa - watch it!',
    'Careful not to kick up too much powder',
    "We're number 1!",
    'too much static on this channel - switch to the next',
    'Wow! Check this out!',
    'Interesting formation over here',
    'Looks like some of the old flow is exposed in this area',
    'Watch out for those sand-filled areas - some of them are surprisingly deep!',
    "Ow! ...I'm OK",
    'Look at that view!',
    'Where is everyone?',
    'Anyone have an extra sample bag?',
    'This is Rover-14, how are you doing out there?',
    'I need an extra battery pack',
    "This isn't quite what I expected",
    'Huh - this is strange...',
    'I think this surface is not completely stable',
    'Whoa - watch it!',
    'Careful not to kick up too much powder',
    "We're number 1!",
    'too much static on this channel - switch to the next'
    ],
    babbleFrequency: .07,
    mixins: [Game.EntityMixins.PeacefulRoamingBehaviorController, Game.EntityMixins.Allier, Game.EntityMixins.RadioUser, Game.EntityMixins.Babbler, Game.EntityMixins.RandomMoveChooser]
}


Game.Entity.Stupidity = new Game.Entity({
    name: 'stupidity',
    group: 'concept',
    character: ' ',
    description: "strategically poor choices, which tactically bad decisions failed to redeem",
    mixins: [Game.EntityMixins.MeleeAttacker]
});

////////////////////////////////////////////////////////////////

// Create our central entity repository
Game.EntityRepository = new Game.Repository('entities', Game.Entity);

Game.EntityRepository.define('fruiting fungus', {
    name: 'fruiting fungus',
    group: 'fungus',
    character: '%',
    description: "You're not sure about the chemical and biological details, but on the surface this looks very much like a large mushroom patch. Occasionally a puff of spores is visible in the air near it.",
    foreground: 'brown',
    maxHp: 15,
    corpseName: 'pile of slimey mushroom caps',
    corpseDescription: 'the analyzer says they\'re edible, but they don\'t look especially appetizing',
    defaultActionDuration: 4600,
    corpseFoodValue: 20,
    corpseSizeFactor: 130,
    suicideSpawnEntityName: 'quiescent fungus',
    mixins: [Game.EntityMixins.FruitingFungusActor, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.SuicideSpawner]
});

Game.EntityRepository.define('docile fungus', {
    name: 'docile fungus',
    group: 'fungus',
    character: '%',
    description: "This looks like a very healthy patch of mushrooms. The hyphae at the edge squirm a bit, but aren't aggressive... at least not towards anything living.",
    foreground: 'yellow',
    maxHp: 10,
    corpseName: 'pile of firm, aromatic mushroom caps',
    corpseDescription: 'disturbing source aside, you can hardly wait to dig in - they\'re delicious!',
    corpseFoodValue: 95,
    corpseFoodDensityFactor: 2.5,
    defaultActionDuration: 10000,
    fixedXp: 0,
    mixins: [Game.EntityMixins.DocileFungusActor, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.FixedExperiencePoints]
}, {
    disableRandomCreation: true
});

Game.EntityRepository.define('spreading fungus', {
    name: 'spreading fungus',
    group: 'fungus',
    character: '%',
    description: "It appears fungal, but the mycelium counterpart is actively move around, apparently seeking nutrients. You can almost make out _something_ in the middle, but it's too obscured to be sure.",
    foreground: 'pink',
    attackValue: 4,
    defenseValue: 1,
    maxHp: 25,
    corpseName: 'spore-y mass',
    corpseFoodValue: 1,
    corpseSizeFactor: 230,
    defaultActionDuration: 1250,
    suicideSpawnEntityName: 'fruiting fungus',
    awakenPercentRate: 6,
    awakenSpawnEntityName: 'fungus zombie',
    allies: ['fungus'],
    mixins: [Game.EntityMixins.SpreadingFungusActor, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.Allier, Game.EntityMixins.SuicideSpawner, Game.EntityMixins.DamageAwakener]
});


Game.EntityRepository.define('quiescent fungus', {
    name: 'quiescent fungus',
    group: 'fungus',
    character: '%',
    description: "Some kind of fungal-oid. Apparently dormant.",
    foreground: 'grey',
    maxHp: 5,
    corpseName: 'spore-y mass',
    corpseFoodValue: 1,
    corpseSizeFactor: 24,
    awakenPercentRate: 12,
    fixedXp: 1,
    awakenSpawnEntityName: 'spreading fungus',
    mixins: [Game.EntityMixins.Destructible,Game.EntityMixins.CorpseDropper, Game.EntityMixins.DamageAwakener, Game.EntityMixins.FixedExperiencePoints]
});

Game.EntityRepository.define('stunted fungus', {
    name: 'stunted fungus',
    group: 'fungus',
    character: '%',
    description: "a twisted mass of thin, weak strands - it looks like something went wrong with its growth",
    foreground: '#987',
    maxHp: 2,
    fixedXp: .25,
    mixins: [Game.EntityMixins.Destructible, Game.EntityMixins.FixedExperiencePoints]
});


Game.EntityRepository.define('fungus zombie', {
    name: 'fungus zombie',
    group: 'fungus',
    character: 'z',
    description: "This was once a creature of some sort, but it's body has been completely invaded and subsequently controlled by some kind of fungal network. Ew.",
    foreground: 'pink',
    attackValue: 5,
    defenseValue: 3,
    maxHp: 18,
    sightRadius: 3,
    bumpsThings: true,
    corpseName: 'spore-y mass',
    corpseFoodValue: 1,
    suicideSpawnEntityName: 'spreading fungus',
    defaultActionDuration: 1750,
    baseBehavior: Game.EntityBehaviors.AggressiveWanderBehavior,
    allies: ['fungus'],
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.Allier, 
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.Seer, Game.EntityMixins.SuicideSpawner, Game.EntityMixins.AutoDegrader, Game.EntityMixins.Suicider,
             Game.EntityMixins.IsFungusZombie, Game.EntityMixins.RandomMoveChooser]
});

Game.EntityRepository.define('bat', {
    name: 'bat-beast',
    character: 'b',
    description: "This large, bluish, bat-like creature seems non-hostile. It mostly just flies around with it's mouth open, avoiding anything big and living off whatever it can filter out of the air.",
    foreground: 'blue',
    maxHp: 5,
    corpseFoodValue: 35,
    moveDuration: 500,
    mixins: [Game.EntityMixins.PeacefulRoamingBehaviorController, Game.EntityMixins.Destructible,Game.EntityMixins.CorpseDropper, Game.EntityMixins.RandomMoveChooser]
});

Game.EntityRepository.define('golden lizard', {
    name: 'golden lizard',
    character: 'l',
    description: "OK, maybe not *actually* a lizard, but it *looks* pretty lizard-y. The claws and visible teeth suggest it's an predator, but it generally wanders aimlessly. It probably is employing some sort of low-energy lurk-and-pounce strategy.",
    foreground: 'yellow',
    maxHp: 7,
    attackValue: 4,
    defenseValue: 1,
    bumpsThings: true,
    corpseFoodValue: 75,
    baseBehavior: Game.EntityBehaviors.AggressiveWanderBehavior,
    behaviors: [Game.EntityBehaviors.AggressiveWanderBehavior],
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.Retaliator,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.RandomMoveChooser]
});

Game.EntityRepository.define('rock lizard', {
    name: 'rock lizard',
    character: 'l',
    description: "It's not very big, but it's got formidable natural protection. It reminds you a bit of a snapping turtle, but it's scutes are distributed all over it's body instead of being fused into a single shell. It's claws and snout look extremely well adapted for digging through the local stone.",
    foreground: 'goldenrod',
    maxHp: 4,
    attackValue: 2,
    defenseValue: 5,
    bumpsThings: true,
    digRate: 20,
    corpseFoodValue: 45,
    defaultActionDuration: 1350,
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.Digger, Game.EntityMixins.CorpseDropper,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.RandomMoveChooser]
});

Game.EntityRepository.define('whip-spine', {
    name: 'whip-spine',
    character: 's',
    description: "Snake-like, but with a large spike where you'd expect to see a head. It can probably strike pretty quickly when coiled, but would take a while to recover.",
    foreground: 'green',
    maxHp: 9,
    attackValue: 3,
    bumpsThings: true,
    corpseFoodValue: 30,
    moveDuration: 350,
    meleeDuration: 3800,
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.Seer, Game.EntityMixins.CorpseDropper,
             Game.EntityMixins.Retaliator, Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.RandomMoveChooser]
});


Game.EntityRepository.define('ooze', {
    name: 'ooze',
    character: 'o',
    description: "Sort of like a large slime-mold, but a LOT more active. Apparently has some sort of rudimentary sensory system - maybe scent-based. Leaves noticeable etched traces as it passes across the stone floor - this thing is beyond omnivorous.",
    foreground: 'lightGreen',
    maxHp: 10,
    attackValue: 5,
    sightRadius: 2,
    bumpsThings: true,
    allies: ['giant zombie symbiote','ooze'],
    baseBehavior: Game.EntityBehaviors.AggressiveWanderBehavior,
    behaviors: [Game.EntityBehaviors.AggressiveWanderBehavior],
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.Seer,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.Allier, Game.EntityMixins.RandomMoveChooser]
});

Game.EntityRepository.define('giant zombie symbiote', {
    name: 'giant zombie symbiote', 
    character: 'Z',
    description: "It looks like oozes and the local fungus have developed some kind of terrifying symbiotic relationship in the process of consuming the poor creature that.... GOOD GOD! IT'S MICAH!",
    foreground: 'teal',
    maxHp: 80,
    attackValue: 24,
    defenseValue: 16,
    level: 5,
    sightRadius: 4,
    bumpsThings: true,
    moveDuration: 1250,
    meleeDuration: 900,
    allies: ['ooze'],
    baseBehavior: Game.EntityBehaviors.AggressiveWanderBehavior,
    behaviors: [Game.EntityBehaviors.AggressiveWanderBehavior],
    mixins: [Game.EntityMixins.GiantZombieActor, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.CorpseDropper, Game.EntityMixins.Seer, 
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.Allier, Game.EntityMixins.RandomMoveChooser]
}, {
    disableRandomCreation: true
});
/*
Game.EntityRepository.define('busy-bug', {
    name: 'busy-bug',
    character: 'x',
    description: "It looks, and acts, like a disturbingly large cross between a spider and a sea urchin.",
    foreground: '#937',
    maxHp: 3,
    attackValue: 4,
    defenseValue: 1,
    sightRadius: 2,
    bumpsThings: true,
    allies: ['busy-bug'],
    baseBehavior: Game.EntityBehaviors.DangerousWanderBehavior,
    behaviors: [Game.EntityBehaviors.DangerousWanderBehavior],
    mixins: [Game.EntityMixins.AggressiveRoamingBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.Seer,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.Allier, Game.EntityMixins.ExplorationMoveChooser]
});



Game.EntityRepository.define('martian', {
    name: 'martian',
    character: 'm',
    description: "Sort of lizard-like, sort of bug-like, and very strange over all. It has six limbs, the middle set of which are more delicate and have finger-like fine manipulators at their ends. The head-analog has faceted, insectoid eyes, and its torso has two rows of... ears? What you at first took to be some marsupial-like pouch is, on closer look, actually a pack slung under its main body! Intelligent, tool-using life!",
    foreground: '#da9',
    maxHp: 18,
    attackValue: 3,
    defenseValue: 3,
    sightRadius: 7,
    corpseFoodValue: 135,
    moveDuration: 1100,
    meleeDuration: 950,
    baseBehavior: Game.EntityBehaviors.AggressiveWanderBehavior,
    behaviors: [Game.EntityBehaviors.AggressiveWanderBehavior],
    mixins: [Game.EntityMixins.MartianBehaviorController, Game.EntityMixins.MeleeAttacker, Game.EntityMixins.Destructible, Game.EntityMixins.Seer, Game.EntityMixins.CorpseDropper, Game.EntityMixins.Retaliator,
             Game.EntityMixins.ExperienceGainer, Game.EntityMixins.RandomStatGainer, Game.EntityMixins.ExplorationMoveChooser]
});
*/