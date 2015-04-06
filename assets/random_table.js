Game.ALL_RANDOM_TABLES = {};

// A random table has a name and a source repository, and a table that specifies the items, rates, and other such things
Game.RandomTable = function(name, repository, table) {
    this._name = name;
    Game.ALL_RANDOM_TABLES[this._name] = this;

    this._repository = repository;    

    this._randTable = [];
    this._liveWeightTotal = 0;
    this.setupRandTable(table);
};

/*
the table is an array of entries, each entry being a hash with

name: REQUIRED the name/key used in the repository, or the string 'nothing'

weight: a positive integer number - used for weighted distribution of things (default= 1)

flag_decrement: if true, count is decremented each time this entry is picked (default= false)
flag_deweight: if true, weight is decremented each time this entry is picked (default= false)
count: number of said things left in the table (default= weight)
on_exhausted: "remove" - weight is set to 0; 'nothing' - return null; or "substitute_random_table" or "substitute_repo_entry" - use info in substitute_with  (default= "remove")
substitute_with: name of a random table, or name of an entry in the repository that back this random table

*/
Game.RandomTable.prototype.setupRandTable = function(srcTable) {
    this._randTable = [];
    for (var i=0;i<srcTable.length;i++) {
        if (! srcTable[i].name) {
            continue;
        }
        var newEntry = {
            'name':srcTable[i].name,
            'weight':1,
            'flag_decrement':false,
            'flag_deweight':false,
            'count':1,
            'on_exhausted':'remove',
            'substitute_with':''
        };
        if (srcTable[i].hasOwnProperty('weight')) {
            newEntry.weight = srcTable[i].weight;
        }
        if (srcTable[i].hasOwnProperty('flag_decrement')) {
            newEntry.flag_decrement = srcTable[i].flag_decrement;
        }
        if (srcTable[i].hasOwnProperty('flag_deweight')) {
            newEntry.flag_deweight = srcTable[i].flag_deweight;
        }
        if (srcTable[i].hasOwnProperty('count')) {
            newEntry.count = srcTable[i].count;
        } else {
            newEntry.count = srcTable[i].weight;
        }
        if (srcTable[i].hasOwnProperty('on_exhausted')) {
            if (srcTable[i].on_exhausted == 'substitute_random_table') {
                if (Game.ALL_RANDOM_TABLES.hasOwnProperty(srcTable[i].substitute_with)) {
                    newEntry.on_exhausted = srcTable[i].on_exhausted;
                    newEntry.substitute_with = srcTable[i].substitute_with;
                }
            } else
            if (srcTable[i].on_exhausted == 'substitute_repo_entry') {
                if (this._repository.has(srcTable[i].substitute_with)) {
                    newEntry.on_exhausted = srcTable[i].on_exhausted;
                    newEntry.substitute_with = srcTable[i].substitute_with;
                }
            } else
            if (srcTable[i].on_exhausted == 'nothing') {
                newEntry.on_exhausted = srcTable[i].on_exhausted;
            }
        }
        
        this._randTable.push(newEntry);
    }
    this.setupLiveWeightTotal();
}


Game.RandomTable.prototype.setupLiveWeightTotal = function() {
    this._liveWeightTotal = 0;
    for (var i=0;i<this._randTable.length;i++) {
        this._liveWeightTotal += this._randTable[i].weight;
    }    
}


Game.RandomTable.prototype.getOne = function() {
    var r = Game.util.getRandomInteger(1,this._liveWeightTotal);

    var curWeightCheck = 0;
    for (var i=0;i<this._randTable.length;i++) {
        curWeightCheck += this._randTable[i].weight;
        if (curWeightCheck >= r) {
            if (this._randTable[i].count > 0) {
                if (this._randTable[i].flag_decrement) {
                    this._randTable[i].count--;
                }
                if (this._randTable[i].flag_deweight) {
                    this._randTable[i].weight--;
                    this.setupLiveWeightTotal();
                }
                if (this._randTable[i].name == 'nothing') {
                    return null;
                }
                return this._repository.create(this._randTable[i].name);
            } else {
                if (this._randTable[i].on_exhausted == 'remove') {
                    this._randTable[i].weight = 0;
                    this.setupLiveWeightTotal();
                    return this.getOne();
                } else 
                if (this._randTable[i].on_exhausted == 'nothing') {
                    return null;
                } else 
                if (this._randTable[i].on_exhausted == 'substitute_random_table') {
                    return Game.ALL_RANDOM_TABLES[this._randTable[i].substitute_with].getOne();
                } else 
                if (this._randTable[i].on_exhausted == 'substitute_repo_entry') {
                    this._repository.create(this._randTable[i].substitute_with);
                }
                return null;
            }
        }
    }
}