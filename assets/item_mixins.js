Game.ItemMixins = {};

// Edible mixins
Game.ItemMixins.Edible = {
    name: 'Edible',
    init: function(template) {
        // Number of points to add to hunger
        this._foodValue = template['foodValue'] || 5;
        // Number of times the item can be consumed
        this._maxConsumptions = template['consumptions'] || 1;
        this._remainingConsumptions = this._maxConsumptions;
    },
    eat: function(entity) {
        if (entity.hasMixin('FoodConsumer')) {
            if (this.hasRemainingConsumptions()) {
                entity.modifyFullnessBy(this._foodValue);
                this._remainingConsumptions--;
                entity.raiseEvent('onEat',this);
            }
        }
    },
    hasRemainingConsumptions: function() {
        return this._remainingConsumptions > 0;
    },
    describe: function() {
        if (this._maxConsumptions != this._remainingConsumptions) {
            return 'partly eaten ' + Game.Item.prototype.describe.call(this);
        } else {
            return this._name;
        }
    },
    setFoodValue: function(foodValue) {
        this._foodValue = foodValue;
    },
    getFoodValue: function() {
        return this._foodValue;
    },
    alterFoodValue: function(delta) {
        this._foodValue += delta;
    },
    listeners: {
        'details': function() {
            var det = [{key: 'food', value: this._foodValue}];
            if (this._maxConsumptions > 1) {
                det.push({key: 'food uses', value: this._remainingConsumptions+'/'+this._maxConsumptions});
            }
            return det;
        }
    }
};

Game.ItemMixins.Wearable = {
    name: 'Wearable',
    init: function(template) {
        this._wearable = template['wearable'] || false;
    },
    isWearable: function() {
        return this._wearable;
    }
};

/*
    listeners: {
        'details': function() {
            var results = [];
            if ((this._wearable) || (this.getDefenseValue() > 0)) {
                results.push({key: 'defense', value: this.getDefenseValue()});
            }
            return results;
        }
    }
*/

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
    listeners: {
        'details': function() {
            var det = [{key: 'rangedAttackDamageBonus', value: this.getRangedAttackDamageBonus()}];
            var ammoTypes = [this._name];
            if (this._group) {
                ammoTypes.push(this._group);
            }
            if (this._supergroup) {
                ammoTypes.push(this._supergroup);
            }
            det.push({key: 'ammo type', value: ammoTypes.join()})
            return det;
        }
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
            return [{key: 'rangedAttackDamageAdder', value: this.getRangedAttackDamageAdder()},
                    {key: 'rangedAttackDamageMultiplier', value: this.getRangedAttackDamageMultipler()},
                    {key: 'uses ammo', value: this._allowedAmmo.join()}];
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
                this.growAt(map,x,y,z);
                return;
            }


            // check items at that location
            //    at first valid substrate, remove the item from the map, and do germination and place the result of that on the map at that location
            var items = map.getItemsAt(x,y,z);
            for (var i=0;i<items.length;i++) {
                var item = items[i];
                if (item && this.canGrowOn(item)) {
                    map.removeItem(item,x,y,z);
                    this.growAt(map,x,y,z);
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
                this.growAt(map,x,y,z);
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
            return [{key: 'goodGrowthRate', value: this.getGrowthLiklihoodGood()},
                    {key: 'generallyValidSubstrates', value: this.getSeedTargets().join(',')},
                    {key: 'willNotGrowOn', value: this.getSeedExclusions().join(',')},
                    ];
        }
    }
};