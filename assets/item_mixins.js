Game.ItemMixins = {};

// Edible mixins
Game.ItemMixins.Edible = {
    name: 'Edible',
    init: function(template) {
        if (template['foodDensity']) {
            this._foodDensity = template['foodDensity'];  // food value per unit of bulk of this item
        } else if (template['foodValue']) {
            this._foodDensity = Math.floor(template['foodValue']/(this._invBulk/1000)) + 1; // foodDensity may be set based on a given foodValue for the item (close, but not exact)
        } else {
            this._foodDensity = 10; // default is 10 turns per unit of bulk
        }
        
        this._originalBulk = this._invBulk;
    },
    getConsumptionFractionDescription: function() {
        var remainsFrac = this._invBulk / this._originalBulk;        
        if (remainsFrac > .99) { return ''; }
        if (remainsFrac > .9) { return 'slightly nibbled '; }
        if (remainsFrac > .7) { return 'nibbled '; }
        if (remainsFrac > .5) { return 'well chewed '; }
        if (remainsFrac > .3) { return 'mostly eaten '; }
        if (remainsFrac > .1) { return 'almost entirely eaten '; }
        return 'scraps of ';        
    },
    describe: function() {
        var descrLead = this.getConsumptionFractionDescription();
        if (descrLead == 'scraps of ') {
            return descrLead + Game.Item.prototype.describeA.call(this);
        } else {
            return descrLead + Game.Item.prototype.describe.call(this);
        }
    },
    getFoodValue: function() {
        return Math.trunc(this._foodDensity * this._invBulk / 1000);
    },
    setFoodValue: function(v) {
        this._foodDensity = Math.floor(v/(this._invBulk/1000));
    },
    setFoodDensity: function(v) {
        this._foodDensity = _foodDensity;
    },
    getFoodDensity: function() {
        return this._foodDensity;
    },
    increaseFoodDensityByFactor: function(foodDensityFactor) {
        this._foodDensity *= foodDensityFactor;
        this._invBulk = Math.floor(this._invBulk/foodDensityFactor);
        this._originalBulk = Math.floor(this._originalBulk/foodDensityFactor);
        this._invWeight = Math.floor(this._invWeight/foodDensityFactor);
    },
    listeners: {
        'details': function() {
            var det = [{key: 'food', value: this.getFoodValue()}];
            return det;
        },
        'calcDetails': function() {
            var det = [{key: 'foodValue', value: this._foodValue}];
            det.push({key: 'foodDensity', value: this._foodDensity});
            return det;
        }
    }
};

Game.ItemMixins.DigTool = {
    name: 'DigTool',
    init: function(template) {
        this._digMultiplier = template['digMultiplier'] || 1;
        this._digAdder = template['digAdder'] || 1;
    },
    getDigMultiplier: function() {
        return this._digMultiplier;
    },
    setDigMultiplier: function(v) {
        this._digMultiplier = v;
    },
    getDigAdder: function() {
        return this._digAdder;
    },
    setDigAdder: function(v) {
        this._digAdder = v;
    },
    listeners: {
        'details': function() {
            return [{key: 'dig-times', value: this.getDigMultiplier()},
                    {key: 'dig-plus', value: this.getDigAdder()}
                    ];
        },
        'calcDetails': function() {
            return [{key: 'digMultiplier', value: this.getDigMultiplier()},
                    {key: 'digAdder', value: this.getDigAdder()}
                    ];
        },
        'onDigging': function() {
            return [{key: 'digMultiplier', value: this.getDigMultiplier()},
                    {key: 'digAdder', value: this.getDigAdder()}
                    ];
        }
    }
};


Game.ItemMixins.Ammo = {
    name: 'Ammo',
    init: function(template) {
        // jump through some hoops to allow spec of 0
        this._rangedAttackDamageBonus = 0;
        if ('rangedAttackDamageBonus' in template) {
            this._rangedAttackDamageBonus = template['rangedAttackDamageBonus'];
        }
        this._reuseChance = template['reuseChance'] || .25;
    },
    getRangedAttackDamageBonus: function () {
        return this._rangedAttackDamageBonus;
    },
    setRangedAttackDamageBonus: function (v) {
        this._rangedAttackDamageBonus = v;
    },
    getReuseChance: function () {
        return this._reuseChance;
    },
    setReuseChance: function (v) {
        this._reuseChance = v;
    },
    getAmmoTypes: function() {
        var ammoTypes = [this._name];
        if (this._group) {
            ammoTypes.push(this._group);
        }
        if (this._supergroup) {
            ammoTypes.push(this._supergroup);
        }
        return ammoTypes;
    },
    listeners: {
        'details': function() {
            var det = [{key: 'fire/fling damage bonus', value: this.getRangedAttackDamageBonus()}];
            det.push({key: 'ammo type', value: '('+this.getAmmoTypes().join()+')'});
            return det;
        },
        'calcDetails': function() {
            var det = [{key: 'rangedAttackDamageBonus', value: this.getRangedAttackDamageBonus()}];
            det.push({key: 'ammoTypes', value: ','+this.getAmmoTypes().join()+','}); // allows easier substring searching
            return det;
        },

    }
};


Game.ItemMixins.Shooter = {
    name: 'Shooter',
    init: function(template) {
        this._allowedAmmo = template['allowedAmmo'] || [];
        
        // jump through some hoops to allow spec of 0

        this._rangedAttackDamageAdder = 0;
        if ('rangedAttackDamageAdder' in template) {
            this._rangedAttackDamageAdder = template['rangedAttackDamageAdder'];
        }

        this._rangedAttackDamageMultipler = 0;
        if ('rangedAttackDamageMultipler' in template) {
            this._rangedAttackDamageMultipler = template['rangedAttackDamageMultipler'];
        }
    },
    getRangedAttackDamageAdder: function () {
        return this._rangedAttackDamageAdder;
    },
    setRangedAttackDamageAdder: function (v) {
        this._rangedAttackDamageAdder = v;
    },
    getRangedAttackDamageMultipler: function () {
        return this._rangedAttackDamageMultipler;
    },
    setRangedAttackDamageMultipler: function (v) {
        this._rangedAttackDamageMultipler = v;
    },
    getAllowedAmmoStr: function() {
        return this._allowedAmmo.join();
    },
    canUseAmmo: function(ammo) {
        return (this._allowedAmmo.indexOf(ammo.getName())>-1) 
               || (this._allowedAmmo.indexOf(ammo.getGroup())>-1)
               || (this._allowedAmmo.indexOf(ammo.getSuperGroup())>-1);
    },
    listeners: {
        'details': function() {
            return [{key: 'ranged-plus', value: this.getRangedAttackDamageAdder()},
                    {key: 'ranged-times', value: this.getRangedAttackDamageMultipler()},
                    {key: 'uses ammo', value: this._allowedAmmo.join()}];
        },
        'calcDetails': function() {
            return [{key: 'rangedAttackDamageAdder', value: this.getRangedAttackDamageAdder()},
                    {key: 'rangedAttackDamageMultiplier', value: this.getRangedAttackDamageMultipler()},
                    {key: 'allowedAmmo', value: this._allowedAmmo.join()}];
        },
        'onShooting': function(ammo) {
            if (ammo && this.canUseAmmo(ammo)) {
//            if (this.canUseAmmo(ammo)) {
                return [{key: 'rangedAttackDamageAdder', value: this.getRangedAttackDamageAdder()},
                        {key: 'rangedAttackDamageMultiplier', value: this.getRangedAttackDamageMultipler()}];
            }
            return [];
        }
    }
};
    
    
Game.ItemMixins.Seeder = {
    name: 'Seeder',
    init: function(template) {
        this._seedTargets = template['seedTargets'] || [];
        this._seedExclusions = template['seedExclusions'] || [];
        this._growthLiklihoodGood = template['growthLiklihoodGood'] || .15;
        this._seedGoodResult = template['seedGoodResult'] || '';
        this._seedBadResult = template['seedBadResult'] || '';
    },
    getSeedTargets: function() {
        return this._seedTargets;
    },
    setSeedTargets: function(v) {
        this._seedTargets = v;
    },
    getSeedExclusions: function() {
        return this._seedExclusions;
    },
    setSeedExclusions: function(v) {
        this._seedExclusions = v;
    },
    getGrowthLiklihoodGood: function() {
        return this._growthLiklihoodGood;
    },
    setGrowthLiklihoodGood: function(v) {
        this._growthLiklihoodGood = v;
    },
    getSeedGoodResult: function() {
        return this._seedGoodResult;
    },
    setSeedGoodResult: function(v) {
        this._seedGoodResult = v;
    },
    getSeedBadResult: function() {
        return this._seedBadResult;
    },
    setSeedBadResult: function(v) {
        this._seedBadResult = v;
    },
    canGrowOn: function(substrate) {        
        var excludeRes = (this._seedExclusions.indexOf(substrate.getName()) > -1);
        if (substrate instanceof Game.DynamicGlyph) {
            excludeRes = excludeRes || (this._seedExclusions.indexOf(substrate.getGroup()) > -1) || (this._seedExclusions.indexOf(substrate.getSuperGroup()) > -1);
        }
        if (excludeRes) {
            return false;
        }
        
        var targetRes = (this._seedTargets.indexOf(substrate.getName()) > -1);
        if (substrate instanceof Game.DynamicGlyph) {
            targetRes = targetRes || (this._seedTargets.indexOf(substrate.getGroup()) > -1) || (this._seedTargets.indexOf(substrate.getSuperGroup()) > -1);
        }
        return targetRes;        
    },
    growAt: function(map,x,y,z) {
        var newEntity;
        if (ROT.RNG.getUniform() < this.getGrowthLiklihoodGood()) {
            newEntity = Game.EntityRepository.create(this.getSeedGoodResult());
        } else {
            newEntity = Game.EntityRepository.create(this.getSeedBadResult());
        }
        newEntity.setPosition(x,y,z);
        map.addEntity(newEntity);
        
        Game.sendMessageNearby(map,x,y,z, 'The %s grows into %s', [this.getName(),newEntity.describeA(false)]);
        
        return newEntity;
    },
    listeners: {
         'onPlanted': function(map,x,y,z) {
            //console.log('onPlanted!');
            //console.dir(this);
         
            map.removeItem(this,x,y,z);
            
            // check entity at that location
            //    if a valid substrate, remove the entity from the map (don't kill it - this generate no XP), and do germination and place the result of that on the map at that location
            var entity = map.getEntityAt(x,y,z);
            if (entity && this.canGrowOn(entity)) {
                map.removeEntity(entity);
                newEntity = this.growAt(map,x,y,z);
                return;
            }


            // check items at that location
            //    at first valid substrate, remove the item from the map, and do germination and place the result of that on the map at that location
            var items = map.getItemsAt(x,y,z);
            for (var i=0;i<items.length;i++) {
                var item = items[i];
                if (item && this.canGrowOn(item)) {
                    map.removeItem(item,x,y,z);
                    newEntity = this.growAt(map,x,y,z);
                    if (item.isA('corpse')) {
                        newEntity.raiseEvent('onSpawnedFromCorpse',item);
                    }
                    return;
                }
            }

            // check the tile at that location
            //    if a valid substrate, do germination and place the result of that on the map at that location
            var tile = map.getTile(x,y,z);
            if (tile && this.canGrowOn(tile)) {
                if (tile.isDiggable()) {
                    map.dig(null,1,x,y,z);
                }
                newEntity = this.growAt(map,x,y,z);
                return;
            }
        },
        'onLanded': function(map,x,y,z) {
            this.raiseEvent('onPlanted',map,x,y,z);
        },
//        'onDropped': function(map,x,y,z) {
//            this.raiseEvent('onPlanted',map,x,y,z);
//        },
        'details': function() {
            return [{key: 'good growth chance', value: this.getGrowthLiklihoodGood()},
                    {key: 'grows on', value: this.getSeedTargets().join(',')},
                    {key: 'will not grow on', value: this.getSeedExclusions().join(',')},
                    ];
        },
        'calcDetails': function() {
            return [{key: 'goodGrowthRate', value: this.getGrowthLiklihoodGood()},
                    {key: 'generallyValidSubstrates', value: this.getSeedTargets().join(',')},
                    {key: 'willNotGrowOn', value: this.getSeedExclusions().join(',')},
                    ];
        }
    }
};



Game.ItemMixins.Container = {
    name: 'Container',
    init: function(template) {
        this._maxCarryWeight = template['maxCarryWeight'] || 10000;
        this._maxCarryBulk = template['maxCarryBulk'] || 10000;
        this._accessDuration = template['accessDuration'] || 1000;
        
        this._currentCarryWeight = 0;
        this._currentCarryBulk = 0;

        this._items = new Array();
    },
    
    getMaxCarryWeight: function() {
        return this._maxCarryWeight;
    },
    setMaxCarryWeight: function(v) {
        this._maxCarryWeight = v;
    },
    getMaxCarryBulk: function() {
        return this._maxCarryBulk;
    },
    setMaxCarryBulk: function(v) {
        this._maxCarryBulk = v;
    },
    getAccessDuration: function() {
        return this._accessDuration;
    },
    setAccessDuration: function(v) {
        this._accessDuration = v;
    },
    
    
    getCurrentCarriedWeight: function() {
        return this._currentCarryWeight;
    },
    getInvWeight:function() {
        return this.getCurrentCarriedWeight()+Game.Item.prototype.getInvWeight.call(this);
    },
    getCurrentCarriedBulk: function() {
        return this._currentCarryBulk;
    },
    
    getWeightStatusString: function() {
        return (this.getCurrentCarriedWeight()/1000)+'/'+(this.getMaxCarryWeight()/1000)+' kg';
    },

    getBulkStatusString: function() {
        return (this.getCurrentCarriedBulk()/1000)+'/'+(this.getMaxCarryBulk()/1000)+' L';
    },
    getBulkStatusColor: function() {
        var fillRatio = this._currentCarryBulk/this._maxCarryBulk;
        if (fillRatio >= 1) {return '%c{red}';}
        if (fillRatio >= .9) {return '%c{orange}';}
        if (fillRatio >= .8) {return '%c{yellow}';}
        return '';
    },

    _calculateWeightAndBulk: function() {
        this._currentCarryBulk = 0;
        this._currentCarryWeight = 0;        
        for (var i=0; i<this._items.length; i++) {
            this._currentCarryWeight += this._items[i].getInvWeight();
            this._currentCarryBulk +=  this._items[i].getInvBulk();
        }
    },
    
    _sortItemsListByType: function() {
        Game.Item.sortItemArrayByType(this._items);
    },
    _sortItemsListByBulkDesc: function() {
        Game.Item.sortItemArrayByBulkDesc(this._items);
    },
    _sortItemsListByWeightDesc: function() {
        Game.Item.sortItemArrayByWeightDesc(this._items);
    },
    _compactItemsList: function() {
        this._items = Game.Item.compactedItemArrayFrom(this._items);
    },
    _cleanItemsList: function() {
        this._compactItemsList();
        this._sortItemsListByType();
        this._calculateWeightAndBulk();
    },
    
    
    canAddItem: function(itm) {
        return this.canAddItem_bulk(itm) && this.canAddItem_weight(itm);
    },
    canAddItem_bulk: function(itm) {
        return (itm.getInvBulk() + this._currentCarryBulk <= this._maxCarryBulk);
    },    
    canAddItem_weight: function(itm) {
        return (itm.getInvWeight() + this._currentCarryWeight <= this._maxCarryWeight);
    },
    isOverloaded_bulk: function() {
        return this._currentCarryBulk > this._maxCarryBulk;
    },
    isOverloaded_weight: function() {
        return this._currentCarryWeight > this._maxCarryWeight;
    },


    forceAddItems: function(itmAry) {
        while (itmAry.length > 0) {
            this._items.push(itmAry.shift());
        }
        this._CleanInventory();
        return true;
    },
    addItems: function(itmAry) {
        var leftovers = new Array();
        while (itmAry.length > 0) {
            var itm = itmAry.shift();
            if (this.canAddItem(itm)) {
                this._items.push(itm);
                this._calculateWeightAndBulk();
            } else {
                leftovers.push(itm);
            }
        }
        itmAry = leftovers;
        this._cleanItemsList();
        return leftovers.length == 0;
    },
    extractItems: function(itmAry) {
        var itmIdsAry = itmAry.map(function(curItm){
            curItm.getId();
        });

        for (var i=0;i<this._items.length;i++) {
            if (itmIdsAry.includes(this._items[i].getId())) {
                this._items[i] = false;
            }
        }
        
        this._cleanItemsList();
        return itmAry;
    },
    extractItemsAt: function(idxAry) {
        var extracted = new Array();
        
        for (var i=0;i<idxAry.length;i++) {
            if (this._items[idxAry[i]]) {
                extracted.push(this._items[idxAry[i]]);
                this._items[idxAry[i]] = false;
            }
        }
    
        this._cleanItemsList();
        return extracted;
    },
    extractAllItems: function() {
        var extracted = this._items;
        this._items = new Array();
    
        this._cleanItemsList();
        return extracted;
    },
    
    
    getIndicesOf: function(itmAry) {
        var itmIdxAry = new Array();
        var itmIdsAry = itmAry.map(function(curItm){
            curItm.getId();
        });

        for (var i=0;i<this._items.length;i++) {
            if (itmIdsAry.includes(this._items[i].getId())) {
                itmIdxAry.push(i);
            }
        }
        
        return itmIdxAry;
    },

    listeners: {
        'details': function() {
            return [{key: 'capacity', value: this.getWeightStatusString()+', '+this.getBulkStatusString()},
                    {key: 'access time', value: this.getAccessDuration()/1000+'x normal'}
                    ];
        },
        'calcDetails': function() {
            return [{key: 'maxCarryWeight', value: this.getMaxCarryWeight()},
                    {key: 'maxCarryBulk', value: this.getMaxCarryBulk()},
                    {key: 'accessDuration', value: this.getAccessDuration()}
                    ];
        }
    }
};

