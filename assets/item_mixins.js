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
    getName: function() {
        return this.describe();
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
        this._isDigTool = true;
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
        this._maxCarryQuantity = template['maxCarryQuantity'] || -1;
        this._carryTypes = template['carryTypes'] || [];
        this._accessDurationPack = template['accessDuration'] || 1000;
        this._accessDurationUnpack = template['accessDurationUnpack'] || this._accessDurationPack;
        
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
    getMaxCarryQuantity: function() {
        return this._maxCarryQuantity;
    },
    setMaxCarryQuantity: function(v) {
        this._maxCarryQuantity = v;
    },

    getCarryTypes: function() {
        return this._carryTypes;
    },
    setCarryTypes: function(v) {
        this._carryTypes = v;
    },

    getAccessDuration: function() {
        return this._accessDurationPack;
    },
    setAccessDuration: function(v) {
        this._accessDurationPack = v;
    },
    
    getAccessDurationUnpack: function() {
        return this._accessDurationUnpack;
    },
    setAccessDurationUnpack: function(v) {
        this._accessDurationUnpack = v;
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
        return (this.getCurrentCarriedWeight()/1000)+'/'+(this.getMaxCarryWeight()/1000)+'kg';
    },

    getBulkStatusString: function() {
        return (this.getCurrentCarriedBulk()/1000)+'/'+(this.getMaxCarryBulk()/1000)+'L';
    },
    getBulkStatusColor: function() {
        if (this._maxCarryBulk == -1) { return ''; }
        var fillRatio = this._currentCarryBulk/this._maxCarryBulk;
        if (fillRatio >= 1) {return '%c{red}';}
        if (fillRatio >= .9) {return '%c{orange}';}
        if (fillRatio >= .8) {return '%c{yellow}';}
        return '';
    },
    
    getQuantityStatusString: function() {
        if (this.getMaxCarryQuantity() < 1) { return ''; }
        return this._items.length+'/'+this.getMaxCarryQuantity()+'#';
    },

    _calculateWeightAndBulk: function() {
        this._currentCarryBulk = 0;
        this._currentCarryWeight = 0;        
        for (var i=0; i<this._items.length; i++) {
            this._currentCarryWeight += this._items[i].getInvWeight();
            this._currentCarryBulk +=  this._items[i].getInvBulk();
            if (this._name != 'itemHolder' && this._items[i].hasMixin('Container')) {
                this._currentCarryBulk +=  this._items[i].getCurrentCarriedBulk();
            }
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
        return this.canAddItem_bulk(itm) && this.canAddItem_weight(itm) && this.canAddItem_quantity(itm) && this.canAddItem_type(itm);
    },
    canAddItem_quantity: function(itm) {
        if (this.getMaxCarryQuantity() < 1) { return true; }
        if (this.getMaxCarryQuantity() > this._items.length) { return true; }
        return false;
    },
    canAddItem_type: function(itm) {
        if (this._carryTypes.length < 1) { return true; }
        for (var i=0;i<this._carryTypes.length;i++) {
            if (itm.isA(this._carryTypes[i])) { return true; }
        }
        return false;
    },
    canAddItem_bulk: function(itm) {
        if (this._maxCarryBulk == -1) { return true; }
        var checkBulk = itm.getInvBulk() + this._currentCarryBulk;
        if (itm.hasMixin('Container')) {
            checkBulk += itm.getCurrentCarriedBulk();
        }
        return  checkBulk <= this._maxCarryBulk;
    },    
    canAddItem_weight: function(itm) {
        return (this._maxCarryWeight == -1) || (itm.getInvWeight() + this._currentCarryWeight <= this._maxCarryWeight);
    },
    isOverloaded_bulk: function() {
        return (this._maxCarryBulk > -1) && (this._currentCarryBulk > this._maxCarryBulk);
    },
    isOverloaded_weight: function() {
        return (this._maxCarryWeight > -1) && (this._currentCarryWeight > this._maxCarryWeight);
    },


    forceAddItems: function(itmAry) {
        while (itmAry.length > 0) {
            this._items.push(itmAry.shift());
        }
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
    getItems: function() {
        return this._items;
    },
    getItemsAt: function(idxAry) {
        var fetched = new Array();
        
        for (var i=0;i<idxAry.length;i++) {
            if (this._items[idxAry[i]]) {
                fetched.push(this._items[idxAry[i]]);
            }
        }
    
        return fetched;
    },    
    extractItems: function(itmAry) {
//        console.dir(itmAry);
        var itmIdsAry = itmAry.map(function(curItm){
//            console.dir(curItm);
            return curItm.getId();
        });
//        console.dir(itmIdsAry);

        for (var i=0;i<this._items.length;i++) {
            //console.dir(itmIdsAry);
            //console.dir(this._items[i]);
            //console.log('itmIdsAry.includes(1) == '+itmIdsAry.includes(1));
            if (itmIdsAry.indexOf(this._items[i].getId()) > -1 ) {
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
            if (itmIdsAry.indexOf(this._items[i].getId()) > -1) {
                itmIdxAry.push(i);
            }
        }
        
        return itmIdxAry;
    },

    getLimitsString: function() {
        var limits = this.getWeightStatusString()+' '+this.getBulkStatusString();
        if (this.getQuantityStatusString()) {
            limits += ' '+this.getQuantityStatusString();
        }
        return limits;
    },

    listeners: {
        'onNaming': function() {
            return [{key: 'suffix', value: ' ['+this.getLimitsString()+']'}];
        },
        'details': function() {
            var ret = [{key: 'capacity', value: this.getLimitsString()}];
            
            if (this.getAccessDuration() == this.getAccessDurationUnpack()) {
                ret.push({key: 'access time', value: this.getAccessDuration()/1000+'x pack & unpack'});
                       
            } else {
                ret.push({key: 'access time', value: this.getAccessDuration()/1000+'x pack & '+this.getAccessDurationUnpack()/1000+'x unpack'});
            }
            
            if (this.getCarryTypes().length > 0) {
                ret.push({key: 'carry only', value: '['+this.getCarryTypes().join(',')+']'});
            }

            if (this._items.length == 1) {
                ret.push({key: 'carrying', value: '['+this._items[0].getName()+']'});
            } else if (this._items.length > 1) {
                ret.push({key: 'carrying', value: this._items.length+' items'});
            }

            return ret;
        },
        'calcDetails': function() {
            return [{key: 'maxCarryWeight', value: this.getMaxCarryWeight()},
                    {key: 'maxCarryBulk', value: this.getMaxCarryBulk()},
                    {key: 'maxCarryQuantity', value: this.getMaxCarryQuantity()},
                    {key: 'carryTypes', value: this.getCarryTypes()},
                    {key: 'accessDuration', value: this.getAccessDuration()},
                    {key: 'accessDurationUnpack', value: this.getAccessDurationUnpack()}
                    ];
        }
    }
};



Game.ItemMixins.CraftingIngredient = {
    name: 'CraftingIngredient',
    init: function(template) {
        this._craftingGroup = template['craftingGroup'] || 'miscellaneous scraps';
        this._craftingQuality = template['craftingQuality'] || 1;
    },
    getCraftingGroup: function() {
        return this._craftingGroup;
    },
    getCraftingQuality: function() {
        return this._craftingQuality;
    },
    listeners: {
        'details': function() {
            var det = [{key: 'crafting type', value: this._craftingGroup},
                       {key: 'quality', value: this._craftingQuality}];
            return det;
        },
        'calcDetails': function() {
            var det = [{key: 'craftingGroup', value: this._craftingGroup},
                       {key: 'craftingQuality', value: this._craftingQuality}];
            return det;
        }
    }
};

Game.ItemMixins.CraftingBreakdown = {
    name: 'CraftingBreakdown',
    init: function(template) {
        this._breakdownTools = template['breakdownTools'] || [];
        this._breakdownStructures = template['breakdownStructures'] || [];
        
        this._breakdownDuration = template['breakdownDuration'] || 10000;
        
        this._breakdownSuccessChance = template['breakdownSuccessChance'] || 1;  // 0-1
        this._breakdownSuccessCountTable = template['breakdownSuccessCountTable'] || [1]; // random pick from the array gives count for number of outcomes
    
        // NOTE: has either and outcomeObject OR ELSE and outcomeRandomTable, not both
        this._breakdownOutcomeObject = template['breakdownOutcomeObject'] || ''; // a single item name that is created on a success
        this._breakdownOutcomeRandomTable = template['breakdownOutcomeRandomTable'] || ''; // a randomTable with the item names of possible outcomes of a success
    },
    getBreakdownTools: function() {
        return this._breakdownTools;
    },
    getBreakdownStructures: function() {
        return this._breakdownStructures;
    },    
    getBreakdownDuration: function() {
        return this._breakdownDuration;
    },
    getBreakdownSuccessChance: function() {
        return this._breakdownSuccessChance;
    },
    getBreakdownSuccessCountTable: function() {
        return this._breakdownSuccessCountTable;
    },
    getBreakdownOutcomeObject: function() {
        return this._breakdownOutcomeObject;
    },
    getBreakdownOutcomeRandomTable: function() {
            return this._breakdownOutcomeRandomTable;
    },
    listeners: {
    }
};

Game.ItemMixins.CraftingTool = {
    name: 'CraftingTool',
    init: function(template) {
        this._craftingToolGroup = template['craftingToolGroup'] || 'whacker';
        this._craftingToolQuality = template['craftingToolQuality'] || 1;
        this._isCraftTool = true;
    },
    getCraftingToolGroup: function() {
        return this._craftingToolGroup;
    },
    getCraftingToolQuality: function() {
        return this._craftingToolQuality;
    },
    listeners: {
        'details': function() {
            var det = [{key: 'craft tool type', value: this._craftingToolGroup},
                       {key: 'craft tool quality', value: this._craftingToolQuality}];
            return det;
        },
        'calcDetails': function() {
            var det = [{key: 'craftingToolGroup', value: this._craftingToolGroup},
                       {key: 'craftingToolQuality', value: this._craftingToolQuality}];
            return det;
        }
    }
};

/*
Game.ItemMixins.Craftable = {
    name: 'ComposeCraftable',
    init: function(template) {
        this._canCraftCompose = template['canCraftCompose'] || false;
        this._canCraftDecompose = template['canCraftDecompose'] || false;
    
//        this._structureRequirementNamesCompose = template['structureRequirementNamesCompose'] || [];
//        this._toolRequirementNamesCompose = template['toolRequirementNamesCompose'] || [];

//        this._structureRequirementNamesDecompose = template['structureRequirementNamesDecompose'] || this._structureRequirementNamesCompose;
//        this._toolRequirementNamesDecompose = template['toolRequirementNamesDecompose'] || this._toolRequirementNamesCompose;
        
        this._craftingComponentNames = template['craftingComponentNames'] || [];
    },
    canCraftCompose: function(structuresArray,itemsArrayTools,itemsArrayResources) {
            var itemGroups = itemsArrayResources.map(function(resc){return resc.getCraftingGroup()});
            var itemNames = itemsArrayResources.map(function(resc){return resc.getNameSimple()});
            
            Game.util.A1isSupersetOfA2(Game.DynamicGlyph.getNamesFromArray(itemsArrayResources),this._craftingComponentNames);
    },
    canCraftDecompose: function(structuresArray,itemsArrayTools) {
        return
            Game.util.A1isSupersetOfA2(Game.DynamicGlyph.getNamesFromArray(structuresArray),this._structureRequirementNamesDecompose) &&
            Game.util.A1isSupersetOfA2(Game.DynamicGlyph.getNamesFromArray(itemsArrayTools),this._toolRequirementNamesDecompose);
    },
    listeners: {
        'details': function() {
            var det = [];
//            var det = [{key: 'food', value: this.getFoodValue()}];
            return det;
        },
        'calcDetails': function() {
            var det = [];
//            var det = [{key: 'foodValue', value: this._foodValue}];
//            det.push({key: 'foodDensity', value: this._foodDensity});
            return det;
        }
    }
};
*/

// takes : specHash - a hash of names as keys with values of counts, names prefixed with G: indicate a crafting group rather than a specific item, a ~ suffix indicates a minumum quality requirement
// returns : a hash with two entries 'indivs' and 'groups'. indiv items in one array (item repeated as count indicated), groups in a hash of arrays, keyed by quality
function processCraftingSpecToIndivsAndGroups(specHash) {
    var indivs = [];
    var groups = {};


    var specKeys = Object.keys(specHash);
    for (var i=0;i<specKeys.length;i++) {
        if (specKeys[i].startsWith('G:')) {
            var groupInfo = specKeys[i].slice(2) + '~0'; // trim off the G:, append a base quality level (which is subsequently ignored if one was already specified)
            var groupSplit = groupInfo.split('~');
            if (groups[groupSplit[1]] == undefined) {
                groups[groupSplit[1]] = [];
            }
            for (var j=0;j<specHash[specKeys[i]];j++) {
                groups[groupSplit[1]].push(groupSplit[0]);
            }                
        } else {
            for (var j=0;j<specHash[specKeys[i]];j++) {
                indivs.push(specKeys[i]);
            }
        }
    }

    return {'indivs': indivs, 'groups': groups};
}


function processCraftingIndivsAndGroupsToDescription(indivs,groups) {
    var retStr = indivs.join(",");
    for (var q=20;q>=0;q--) {
        if (groups[q] != undefined) {
            if (retStr.length > 0) {
                retStr += '; ';
            }
            if (q<=1) {
                retStr += "any ";
            } else {
                retStr += "quality "+q+"+ ";
            }
            retStr += groups[q].join(",");
        }
    }
    return retStr;
}

Game.ItemMixins.CraftingRecipe = {
    name: 'CraftingRecipe',
    init: function(template) {
    
        template = template || {};
        this._recipeType = template['recipeType'] || 'compose'; // compose, decompose, build
        
        // ingredients are items in inventory that are used up when the recipe is activated
        this._craftingIngredients = template['craftingIngredients'] || {};  // a hash of names as keys with values of counts, names prefixed with G: indicate a crafting group rather than a specific item, a ~ suffix indicates a minumum quality requirement
        this._craftingStructures = template['craftingStructures'] || {}; // a hash of names as keys with values of counts, names prefixed with G: indicate a crafting group rather than a specific item, a ~ suffix indicates a minumum quality requirement
        this._craftingTools = template['craftingTools'] || {}; // a hash of names as keys with values of counts, names prefixed with G: indicate a crafting group rather than a specific item, a ~ suffix indicates a minumum quality requirement

        this._craftingDuration = template['craftingDuration'] || 10000;
        
        this._craftingSuccessChance = template['craftingSuccessChance'] || 1;  // 0-1
        this._craftingSuccessCountTable = template['craftingSuccessCountTable'] || [1]; // random pick from the array gives count for number of outcomes
    
        // NOTE: a recipe has either and outcomeObject OR ELSE and outcomeRandomTable, not both
        this._craftingOutcomeObject = template['craftingOutcomeObject'] || ''; // a single item name that is created on a success
        this._craftingOutcomeRandomTable = template['craftingOutcomeRandomTable'] || ''; // a randomTable with the item names of possible outcomes of a success

        this._setupCheckStructures();
       
        //console.dir(this);

    },
    _setupCheckStructures: function() {
        // process the crafting ingredients to make subsequent checks much easier- indiv items in one array (item repeated as count indicated), groups in a hash of arrays, keyed by quality
        var ingProcessed = processCraftingSpecToIndivsAndGroups(this._craftingIngredients);
        this._craftIngrItemsToCheck = ingProcessed['indivs'];
        this._craftIngrGroupsToCheck = ingProcessed['groups'];

        // structures are world elements that must be in the current or adjacent space to activate this recipe
        var struProcessed = processCraftingSpecToIndivsAndGroups(this._craftingStructures);
        this._craftStruItemsToCheck = struProcessed['indivs'];
        this._craftStruGroupsToCheck = struProcessed['groups'];

        // tools are items in inventory that are NOT used up when the recipe is activated
        var toolProcessed = processCraftingSpecToIndivsAndGroups(this._craftingTools);
        this._craftToolItemsToCheck = toolProcessed['indivs'];
        this._craftToolGroupsToCheck = toolProcessed['groups'];
    },
    _resetForBreakdownItem: function(itm) {
        this._craftingStructures = itm.getCraftingStructures();
        this._craftingTools = itm.getCraftingTools();
        this._craftingDuration = itm.getCraftingDuration();        
        this._successChance = itm.getSuccessChance();
        this._successCountTable = itm.getSuccessCountTable();    
        this._outcomeObject = itm.getOutcomeObject();
        this._outcomeRandomTable = itm.getOutcomeRandomTable();
        
        this._setupCheckStructures();
    },
    getRecipeType: function() {
        return this._recipeType;
    },
    getCraftingDuration: function() {
        return this._craftingDuration;
    },
    getCraftingSuccessChance: function() {
        return this._craftingSuccessChance;
    },
    getCraftingSuccessCountTable: function() {
        return this._craftingSuccessCountTable;
    },
    getCraftingOutcomeObject: function() {
        return this._craftingOutcomeObject;
    },
    getCraftingOutcomeRandomTable: function() {
        return this._craftingOutcomeRandomTable;
    },
    getSuccessObject: function() {
        if (this._craftingOutcomeObject != '') {
            return Game.ItemRepository.create(this._craftingOutcomeObject);
        } else if (this._craftingOutcomeRandomTable!= '') {
            return Game.ItemRepository.create(this._craftingOutcomeRandomTable.getOne());
        }
    },
    canBeUsedWith: function(ingredients,tools,structures) {
        //console.log('TODO: implement real CraftingRecipe.canBeUsedWith');

        var ingAr = Object.keys(ingredients).map(function (key) {
            return ingredients[key];
        });
        var toolAr = Object.keys(tools).map(function (key) {
            return tools[key];
        });
        var struAr = Object.keys(structures).map(function (key) {
            return structures[key];
        });

        //console.log('ingAr:');
        //console.dir(ingAr);
        //console.dir(toolAr);
        //console.dir(struAr);

        if (this.getNameSimple() == 'BREAKDOWN') {
            if (ingAr.length == 1) {
                if (! ingAr[0].hasMixin('CraftingBreakdown')) {
                    return false;
                }
                this._resetForBreakdownItem(ingAr[0]);
            } else {
                return false;
            }
        } else {


            //---------- start ingredient checking ----------------

            // ingredient check order: first specific items, second groups in descending quality order
            // loop though ingredients to look for and the ingAr, pulling items out of ingAr as they're found
            // if a required ingredient is ever not found, return false
            // if at end of all checking there are any remaining ingredients, return false (player can't choose any extras)

            var remainingIngs = [];                
            for (var i=0;i<this._craftIngrItemsToCheck.length;i++) {
                var found = false;
                for (var j=0;j<ingAr.length;j++) {
                    if (!found && ingAr[j].getNameSimple() == this._craftIngrItemsToCheck[i]) {
                        found = true;
                    } else {
                        remainingIngs.push(ingAr[j]);
                    }
                }
                if (! found) { 
                    //console.log('missing ingredient '+this._craftIngrItemsToCheck[i]);
                    return false;
                }
                ingAr = remainingIngs;
                remainingIngs = [];
                //console.log('ingAr:');
                //console.dir(ingAr);
            }

            var qualityKeys = Object.keys(this._craftIngrGroupsToCheck);
            qualityKeys.sort(function(a, b){return b-a}); // descending order of quality
            for (var qi=0;qi<qualityKeys.length;qi++) {
                var qual = qualityKeys[qi];
                var checkAr = this._craftIngrGroupsToCheck[qual];            
                for (var i=0;i<checkAr.length;i++) {
                    var found = false;
                    for (var j=0;j<ingAr.length;j++) {
                        if (!found && ingAr[j].getCraftingQuality() >= qual && ingAr[j].getCraftingGroup() == checkAr[i]) {
                            found = true;
                        } else {
                            remainingIngs.push(ingAr[j]);
                        }
                    }
                    if (! found) { 
                        //console.log('missing ingredient '+checkAr[i]+'~'+qual);
                        return false;
                    }
                    ingAr = remainingIngs;
                    remainingIngs = [];
                    //console.log('ingAr:');
                    //console.dir(ingAr);
                }
            }

            if (ingAr.length>0) {
                //console.log('leftover ingredients:');
                //console.dir(ingAr);
                return false;
            }
        }

        //---------- end ingredient checking, start tool checking ----------------

        // same process as ingredients, but overage is OK

        var remainingTools = [];                
        for (var i=0;i<this._craftToolItemsToCheck.length;i++) {
            var found = false;
            for (var j=0;j<toolAr.length;j++) {
                if (!found && toolAr[j].getNameSimple() == this._craftToolItemsToCheck[i]) {
                    found = true;
                } else {
                    remainingTools.push(toolAr[j]);
                }
            }
            if (! found) { 
                //console.log('missing tool '+this._craftToolItemsToCheck[i]);
                return false;
            }
            toolAr = remainingTools;
            remainingTools = [];
            //console.log('toolAr:');
            //console.dir(toolAr);
        }
        
        var qualityKeys = Object.keys(this._craftToolGroupsToCheck);
        qualityKeys.sort(function(a, b){return b-a}); // descending order of quality
        for (var qi=0;qi<qualityKeys.length;qi++) {
            var qual = qualityKeys[qi];
            var checkAr = this._craftToolGroupsToCheck[qual];            
            for (var i=0;i<checkAr.length;i++) {
                var found = false;
                for (var j=0;j<toolAr.length;j++) {
                    if (!found && toolAr[j].getCraftingToolQuality() >= qual && toolAr[j].getCraftingToolGroup() == checkAr[i]) {
                        found = true;
                    } else {
                        remainingTools.push(toolAr[j]);
                    }
                }
                if (! found) { 
                    //console.log('missing tool '+checkAr[i]+'~'+qual);
                    return false;
                }
                toolAr = remainingTools;
                remainingTools = [];
                //console.log('toolAr:');
                //console.dir(toolAr);
            }
        }
        
        //---------- end tool checking, start structure checking ----------------

        var remainingStrus = [];                
        for (var i=0;i<this._craftStruItemsToCheck.length;i++) {
            var found = false;
            for (var j=0;j<struAr.length;j++) {
                if (!found && struAr[j].getNameSimple() == this._craftStruItemsToCheck[i]) {
                    found = true;
                } else {
                    remainingStrus.push(struAr[j]);
                }
            }
            if (! found) { 
                //console.log('missing Stru '+this._craftStruItemsToCheck[i]);
                return false;
            }
            struAr = remainingStrus;
            remainingStrus = [];
            //console.log('struAr:');
            //console.dir(struAr);
        }
        
        var qualityKeys = Object.keys(this._craftStruGroupsToCheck);
        qualityKeys.sort(function(a, b){return b-a}); // descending order of quality
        for (var qi=0;qi<qualityKeys.length;qi++) {
            var qual = qualityKeys[qi];
            var checkAr = this._craftStruGroupsToCheck[qual];            
            for (var i=0;i<checkAr.length;i++) {
                var found = false;
                for (var j=0;j<struAr.length;j++) {
                    if (!found && struAr[j].getCraftingStruQuality() >= qual && struAr[j].getCraftingStruGroup() == checkAr[i]) {
                        found = true;
                    } else {
                        remainingStrus.push(struAr[j]);
                    }
                }
                if (! found) { 
                    //console.log('missing Stru '+checkAr[i]+'~'+qual);
                    return false;
                }
                struAr = remainingStrus;
                remainingStrus = [];
                //console.log('struAr:');
                //console.dir(struAr);
            }
        }
        
        //---------- end structure checking ----------------

        return true;
    },
    details: function() {
        if (this._name == 'BREAKDOWN') {
            return "INGREDIENTS: selected item\nTOOLS: varies\nSTRUCTURES: varies";
        }
        
        var detStr = "";
        var ingItems = processCraftingIndivsAndGroupsToDescription(this._craftIngrItemsToCheck,this._craftIngrGroupsToCheck);
        if (ingItems.length > 0) {
            detStr += "INGREDIENTS: "+ingItems;
        }
        
        var ingTools = processCraftingIndivsAndGroupsToDescription(this._craftToolItemsToCheck,this._craftToolGroupsToCheck);
        if (ingTools.length > 0) {
            detStr += "\nTOOLS: "+ingTools;
        }
        

        var ingStrus = processCraftingIndivsAndGroupsToDescription(this._craftStruItemsToCheck,this._craftStruGroupsToCheck);
        if (ingStrus.length > 0) {
            detStr += "\nSTRUCTURES: "+ingStrus;
        }

        return detStr;
    },
    listeners: {
        'details': function() {
            var det = [];
            return det;
        },
        'calcDetails': function() {
            var det = [];
//            det.push({key: 'foodDensity', value: this._foodDensity});
            return det;
        }
    }
};