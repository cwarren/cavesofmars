/*
Game.RandomTable = function(name, repository, table) {

the table is an array of entries, each entry being a hash with

name: REQUIRED the name/key used in the repository, or the string 'nothing'

weight: a positive integer number - used for weighted distribution of things (default= 1)

flag_decrement: if true, count is decremented each time this entry is picked (default= false)
flag_deweight: if true, weight is decremented each time this entry is picked (default= false)
count: number of said things left in the table (default= weight)
on_exhausted: "remove" - weight is set to 0; 'nothing' - return null; or "substitute_random_table" or "substitute_repo_entry" - use info in substitute_with  (default= "remove")
substitute_with: name of a random table, or name of an entry in the repository that backs this random table



*/

Game.RandomEntitiesByLevel = [
    new Game.RandomTable('cave_entities_1',Game.EntityRepository,[
        {'name':'fruiting fungus',  'weight':24},
        {'name':'spreading fungus', 'weight':21},
        {'name':'quiescent fungus', 'weight':28},
        {'name':'stunted fungus',   'weight':5},
        {'name':'docile fungus',    'weight':1},
        {'name':'fungus zombie',    'weight':4},
        {'name':'bat',              'weight':18},
        {'name':'busy-bug',         'weight':12},
        {'name':'angry-bug',        'weight':6},
        {'name':'whip-spine',       'weight':9},
        {'name':'ooze',             'weight':2},
        {'name':'golden lizard',    'weight':3},
        {'name':'rock lizard',      'weight':10}
    ]),
    new Game.RandomTable('cave_entities_2',Game.EntityRepository,[
        {'name':'fruiting fungus',  'weight':20},
        {'name':'spreading fungus', 'weight':17},
        {'name':'quiescent fungus', 'weight':18},
        {'name':'stunted fungus',   'weight':5},
        {'name':'docile fungus',    'weight':1},
        {'name':'fungus zombie',    'weight':8},
        {'name':'bat',              'weight':22},
        {'name':'busy-bug',         'weight':15},
        {'name':'angry-bug',        'weight':8},
        {'name':'whip-spine',       'weight':18},
        {'name':'ooze',             'weight':6},
        {'name':'golden lizard',    'weight':10},
        {'name':'rock lizard',      'weight':12}
    ]),
    new Game.RandomTable('cave_entities_3',Game.EntityRepository,[
        {'name':'fruiting fungus',  'weight':16},
        {'name':'spreading fungus', 'weight':14},
        {'name':'quiescent fungus', 'weight':12},
        {'name':'stunted fungus',   'weight':3},
        {'name':'docile fungus',    'weight':1},
        {'name':'fungus zombie',    'weight':29},
        {'name':'bat',              'weight':14},
        {'name':'busy-bug',         'weight':12},
        {'name':'angry-bug',        'weight':9},
        {'name':'whip-spine',       'weight':17},
        {'name':'ooze',             'weight':10},
        {'name':'golden lizard',    'weight':16},
        {'name':'rock lizard',      'weight':10}
    ]),
    new Game.RandomTable('cave_entities_4',Game.EntityRepository,[
        {'name':'fruiting fungus',  'weight':8},
        {'name':'spreading fungus', 'weight':12},
        {'name':'quiescent fungus', 'weight':10},
        {'name':'stunted fungus',   'weight':2},
        {'name':'docile fungus',    'weight':1},
        {'name':'fungus zombie',    'weight':4},
        {'name':'bat',              'weight':7},
        {'name':'busy-bug',         'weight':52},
        {'name':'angry-bug',        'weight':39},
        {'name':'whip-spine',       'weight':9},
        {'name':'ooze',             'weight':2},
        {'name':'golden lizard',    'weight':3},
        {'name':'rock lizard',      'weight':7}
    ]),
    new Game.RandomTable('cave_entities_5',Game.EntityRepository,[
        {'name':'fruiting fungus',  'weight':12},
        {'name':'spreading fungus', 'weight':21},
        {'name':'quiescent fungus', 'weight':28},
        {'name':'stunted fungus',   'weight':5},
        {'name':'docile fungus',    'weight':1},
        {'name':'fungus zombie',    'weight':9},
        {'name':'bat',              'weight':8},
        {'name':'busy-bug',         'weight':12},
        {'name':'angry-bug',        'weight':18},
        {'name':'whip-spine',       'weight':9},
        {'name':'ooze',             'weight':23},
        {'name':'golden lizard',    'weight':30},
        {'name':'rock lizard',      'weight':10}
    ]),
    new Game.RandomTable('cave_entities_6',Game.EntityRepository,[
        {'name':'fruiting fungus',  'weight':11},
        {'name':'spreading fungus', 'weight':21},
        {'name':'quiescent fungus', 'weight':3},
        {'name':'stunted fungus',   'weight':2},
        {'name':'docile fungus',    'weight':1},
        {'name':'fungus zombie',    'weight':17},
        {'name':'bat',              'weight':5},
        {'name':'busy-bug',         'weight':9},
        {'name':'angry-bug',        'weight':16},
        {'name':'whip-spine',       'weight':14},
        {'name':'ooze',             'weight':32},
        {'name':'golden lizard',    'weight':23},
        {'name':'rock lizard',      'weight':10}
    ])
];


Game.RandomInitialItemsByLevel = [
    new Game.RandomTable('cave_items_1',Game.ItemRepository,[
        {'name':'jelly ball',          'weight':50},
        {'name':'geodic nut',          'weight':20},
        {'name':'powerbar',            'weight':10,  'flag_decrement': true, 'count': 4, 'on_exhausted': 'remove'},
        {'name':'human corpse',        'weight':80,  'flag_decrement': true, 'count': 4, 'on_exhausted': 'remove'},
        {'name':'rock',                'weight':170},
        {'name':'stone shot',          'weight':90},
        {'name':'iron nugget',         'weight':50},
        {'name':'iron shot',           'weight':25},
        {'name':'sling',               'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'JAT tool, damaged',   'weight':60,  'flag_decrement': true, 'count': 4, 'on_exhausted': 'remove'},
        {'name':'JAT tool',            'weight':0},
        {'name':'shard blade',         'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'stone sword',         'weight':0},
        {'name':'staff',               'weight':30,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shod staff',          'weight':0},
        {'name':'HEM suit, damaged',   'weight':60,  'flag_decrement': true, 'count': 4, 'on_exhausted': 'remove'},
        {'name':'leather armor',       'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'plated leather armor','weight':1,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit',            'weight':0},
        {'name':'HEM-A suit',          'weight':0},
        {'name':'sack',                'weight':30,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'shoulder-strap',      'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'bandolier',           'weight':0}
    ]),
    new Game.RandomTable('cave_items_2',Game.ItemRepository,[
        {'name':'jelly ball',          'weight':50},
        {'name':'geodic nut',          'weight':30},
        {'name':'powerbar',            'weight':10,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'human corpse',        'weight':80,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'rock',                'weight':130},
        {'name':'stone shot',          'weight':80},
        {'name':'iron nugget',         'weight':50},
        {'name':'iron shot',           'weight':30},
        {'name':'sling',               'weight':30,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'JAT tool, damaged',   'weight':30,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'JAT tool',            'weight':0},
        {'name':'shard blade',         'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'stone sword',         'weight':1,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'staff',               'weight':30,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shod staff',          'weight':0},
        {'name':'HEM suit, damaged',   'weight':60,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'leather armor',       'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'plated leather armor','weight':1,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit',            'weight':0},
        {'name':'HEM-A suit',          'weight':0},
        {'name':'sack',                'weight':20,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'shoulder-strap',      'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'bandolier',           'weight':1,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'}
    ]),
    new Game.RandomTable('cave_items_3',Game.ItemRepository,[
        {'name':'jelly ball',          'weight':40},
        {'name':'geodic nut',          'weight':30},
        {'name':'powerbar',            'weight':3,   'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'human corpse',        'weight':20,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'rock',                'weight':100},
        {'name':'stone shot',          'weight':60},
        {'name':'iron nugget',         'weight':20},
        {'name':'iron shot',           'weight':40},
        {'name':'sling',               'weight':30,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'JAT tool, damaged',   'weight':30,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'JAT tool',            'weight':1,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shard blade',         'weight':40,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'stone sword',         'weight':2,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'staff',               'weight':50,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shod staff',          'weight':1,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit, damaged',   'weight':60,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'leather armor',       'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'plated leather armor','weight':4,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit',            'weight':1,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM-A suit',          'weight':0},
        {'name':'sack',                'weight':30,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'shoulder-strap',      'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'bandolier',           'weight':10,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'}
    ]),
    new Game.RandomTable('cave_items_4',Game.ItemRepository,[
        {'name':'jelly ball',          'weight':30},
        {'name':'geodic nut',          'weight':30},
        {'name':'powerbar',            'weight':1,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'human corpse',        'weight':1,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'rock',                'weight':80},
        {'name':'stone shot',          'weight':30},
        {'name':'iron nugget',         'weight':30},
        {'name':'iron shot',           'weight':50},
        {'name':'sling',               'weight':30,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'JAT tool, damaged',   'weight':30,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'JAT tool',            'weight':3,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shard blade',         'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'stone sword',         'weight':3,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'staff',               'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shod staff',          'weight':3,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit, damaged',   'weight':30,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'leather armor',       'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'plated leather armor','weight':7,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit',            'weight':3,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM-A suit',          'weight':1,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'sack',                'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shoulder-strap',      'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'bandolier',           'weight':10,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'}
    ]),
    new Game.RandomTable('cave_items_5',Game.ItemRepository,[
        {'name':'jelly ball',          'weight':30},
        {'name':'geodic nut',          'weight':30},
        {'name':'powerbar',            'weight':1,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'human corpse',        'weight':1,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'rock',                'weight':80},
        {'name':'stone shot',          'weight':30},
        {'name':'iron nugget',         'weight':40},
        {'name':'iron shot',           'weight':60},
        {'name':'sling',               'weight':30,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'JAT tool, damaged',   'weight':15,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'JAT tool',            'weight':6,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shard blade',         'weight':13,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'stone sword',         'weight':4,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'staff',               'weight':15,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shod staff',          'weight':6,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit, damaged',   'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'leather armor',       'weight':20,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'plated leather armor','weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit',            'weight':5,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM-A suit',          'weight':3,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'sack',                'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shoulder-strap',      'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'bandolier',           'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'}
    ]),
    new Game.RandomTable('cave_items_6',Game.ItemRepository,[
        {'name':'jelly ball',          'weight':30},
        {'name':'geodic nut',          'weight':30},
        {'name':'powerbar',            'weight':1,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'human corpse',        'weight':1,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'rock',                'weight':80},
        {'name':'stone shot',          'weight':25},
        {'name':'iron nugget',         'weight':40},
        {'name':'iron shot',           'weight':50},
        {'name':'sling',               'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'JAT tool, damaged',   'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'JAT tool',            'weight':12,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shard blade',         'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'stone sword',         'weight':7,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'staff',               'weight':3,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'shod staff',          'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit, damaged',   'weight':10,  'flag_decrement': true, 'count': 4, 'on_exhausted': 'remove'},
        {'name':'leather armor',       'weight':4,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'plated leather armor','weight':14,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM suit',            'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'HEM-A suit',          'weight':6,   'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'sack',                'weight':10,  'flag_decrement': true, 'count': 2, 'on_exhausted': 'remove'},
        {'name':'shoulder-strap',      'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'},
        {'name':'bandolier',           'weight':10,  'flag_decrement': true, 'count': 1, 'on_exhausted': 'remove'}
    ])
];