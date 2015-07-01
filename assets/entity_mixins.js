Game._player_name_match_pattern = new RegExp('\\bplayer\\b','i');

Game.sendMessage = function(recipient, message, args, coloring) {
    // Make sure the recipient can receive the message 
    // before doing any work.
    if (recipient && recipient.hasMixin(Game.EntityMixins.MessageRecipient)) {
        // If args were passed, then we format the message, else
        // no formatting is necessary
        if (args) {
            message = vsprintf(message, args);
        }

        if (coloring) {
            message = coloring + message;
        }

        // CSW NOTE : hack to avoid double-messagin the player        
        if (! message.match(Game._player_name_match_pattern)) {
            recipient.receiveMessage(message);
        }
    }
}

Game.sendMessageNearby = function(map, centerX, centerY, z, message, args) {
//    console.log('----------------------');
//    console.log('sending message nearby');

    // If args were passed, then we format the message, else
    // no formatting is necessary
    if (args) {
        message = vsprintf(message, args);
    }
    // Get the nearby entities
    entities = map.getEntitiesWithinRadius(centerX, centerY, z, 5);
    // Iterate through nearby entities, sending the message if
    // they can receive it.
    for (var i = 0; i < entities.length; i++) {
//        console.dir(entities[i]);
        if (entities[i].hasMixin(Game.EntityMixins.MessageRecipient)) {

            // CSW NOTE : hack to avoid double-messagin the player        
            if (! message.match(Game._player_name_match_pattern)) {
                entities[i].receiveMessage(message);
            }
//            entities[i].receiveMessage(message);
        }
    }
//    console.log('----------------------');
}

// Create our Mixins namespace
Game.EntityMixins = {};

Game.EntityMixins.Described = {
    name: 'Described',
    listeners: {
        'details': function() {
            var det = [{key: 'description', value: this.getDescription()}];
            return det;
        }
    }
}

////////////////////////////////////////////////////////////////
// CAPABILITIES

// This signifies our entity posseses a field of vision of a given radius.
Game.EntityMixins.Seer = {
    name: 'Seer',
    groupName: 'Sense',
    init: function(template) {
        this._sightRadius = template['sightRadius'] || 5;
    },
    getSightRadius: function() {
        return this._sightRadius;
    },
    increaseSightRadius: function(value) {
        // If no value was passed, default to 1.
        value = value || 1;
        // Add to sight radius.
        this._sightRadius += value;
        Game.sendMessage(this, "You are can see farther!");
    },
    canSee: function(entity) {
        // If not on the same map or on different floors, then exit early
        if (!entity || this._map !== entity.getMap() || this._z !== entity.getZ()) {
            return false;
        }
        
        return this.canSeeCoord(entity.getX(),entity.getY());
    },
    canSeeCoord: function(x,y) {
        var otherX = x;
        var otherY = y;

        // If we're not in a square field of view, then we won't be in a real
        // field of view either.
        if ((otherX - this._x) * (otherX - this._x) +
            (otherY - this._y) * (otherY - this._y) >
            (this._sightRadius+1) * (this._sightRadius+1)) {
            return false;
        }

        // Compute the FOV and check if the coordinates are in there.
        var found = false;
        this.getMap().getFov(this.getZ()).compute(
            this.getX(), this.getY(), 
            this.getSightRadius(), 
            function(x, y, radius, visibility) {
                if (x === otherX && y === otherY) {
                    found = true;
                }
            });
        return found;
    },
    getVisibleCells: function() {
        var visibleCells = {'byDistance':{}};
        for (var i=0;i<=r;i++) {
            visibleCells['byDistance'][r] = {};
        }
        this.getMap().getFov(this.getZ()).compute(
            this.getX(), this.getY(), 
            this.getSightRadius(), 
            function(x, y, radius, visibility) {
                visibleCells[x+','+y] = 1;
                visibleCells['byDistance'][radius][x+','+y] = 1;
            }
        );
        return visibleCells;                
    },
    canSeeCoord_delta: function(dx,dy) {
        return this.canSeeCoord(this._x+dx,this._y+dy);
    }
    
}

// This signifies our entity posseses a field of vision of a given radius.
Game.EntityMixins.RadioUser = {
    name: 'RadioUser',
    groupName: 'Sense',
    init: function(template) {
        this._radioRange = template['radioRange'] || 35;
    },
    getRadioRadius: function() {
        return this._radioRange;
    },
    canContactOnRadio: function(entity) {
        // If not on the same map or on different floors, then exit early
        if (!entity || this._map !== entity.getMap() || this._z !== entity.getZ()) {
            return false;
        }
        
        return this.canHearOnRadio(entity.getX(),entity.getY());
    },
    canContactOnRadio: function(x,y) {
        var otherX = x;
        var otherY = y;
        
        // If we're not in a square field, then we won't be in a real
        // field either.
        if ((otherX - this._x) * (otherX - this._x) +
            (otherY - this._y) * (otherY - this._y) >
            this._radioRange * this._radioRange) {
            return false;
        }

        var z = this.getZ();
        var map = this.getMap();
        
        // compute A* and check if path length <= radioRange
        var path = new ROT.Path.AStar(this.getX(), this.getY(), function(x, y) {
                return map.getTile(x, y, z).isTransparent();
            }, {topology: 8});
        
        var pathLength = 0;
        path.compute(otherX, otherY, function(x, y) {
            pathLength++;
        });
            
        return pathLength <= this._radioRange;
    },
    listeners: {
        onMakeNoise: function(noiseStr,srcEntity) {
            if (srcEntity.hasMixin('RadioUser') && srcEntity.canContactOnRadio(this)) {
                Game.sendMessage(this,'*click* '+noiseStr+' *click*');
            }
        }
    }
}

// This signifies our entity posseses a field of vision of a given radius.
Game.EntityMixins.Babbler = {
    name: 'Babbler',
    groupName: 'Communicator',
    init: function(template) {
        this._babbleStrings = template['babbleStrings'] || ['...'];
        this._babbleFrequency = template['babbleFrequency'] || .1;
    },
    babble: function() {
        // If not on the same map or on different floors, then exit early
        if (!entity || this._map !== entity.getMap() || this._z !== entity.getZ()) {
            return false;
        }
        
        return this.canHearOnRadio(entity.getX(),entity.getY());
    },
    listeners: {
        onActed: function() {
            //console.log('babbler acted');
            //console.dir(this);
            if (ROT.RNG.getUniform() < this._babbleFrequency) {
                //console.log('babbler makes noise');
                this.getMap().getPlayer().raiseEvent('onMakeNoise',this._babbleStrings.random(),this);  
            }
        }
    }
}

// This signifies our entity posseses a field of vision of a given radius.
Game.EntityMixins.Digger = {
    name: 'Digger',
    init: function(template) {
        this._digRate = template['digRate'] || 2;
    },
    setDigRate: function(v) {
        this._digRate = v;
    },
    getDigRate: function() {
        var rate = this._digRate;
        if (this.hasMixin(Game.EntityMixins.Equipper)) {
            var digMults = [];
            var digAdds = [];

            var w = this.getHolding();
            if (w && w.isTool()) {
                digMults = digMults.concat(Game.util.scanEventResultsFor(w.raiseEvent('onDigging'),'digMultiplier'));
                digAdds = digAdds.concat(Game.util.scanEventResultsFor(w.raiseEvent('onDigging'),'digAdder'));
            }

            var a = this.getWearing();
            if (a) {
                digMults = digMults.concat(Game.util.scanEventResultsFor(a.raiseEvent('onDigging'),'digMultiplier'));
                digAdds = digAdds.concat(Game.util.scanEventResultsFor(a.raiseEvent('onDigging'),'digAdder'));
            }

            for (var j=0;j<digMults.length;j++) {
                rate *= digMults[j];
            }
            for (var j=0;j<digAdds.length;j++) {
                rate += digAdds[j];
            }
        }
        return rate; // NOTE: this may be a decimal! That should be fine...
    },
    increaseDigRate: function(value) {
        value = value || 2;
        this._digRate += value;
        Game.sendMessage(this, "You are a better digger!");
    },
    digAt: function(x,y,z) {
        var baseRate = this.getDigRate();
        var targetTile = this.getMap().getTile(x,y,z);
        if (targetTile.getDigResistance() > baseRate*2.5) {
            Game.sendMessage(this,'The %s is too tough for you to dig; you might need a better digging tool...',[targetTile.getName()]);
            this.setLastActionDuration(25);
            return false;
        }
        
        var baseDur = this.getDigDuration();
        var incrementalActivityDuration = 100;
        var incrementalFactor = this.getDefaultActionDuration()/incrementalActivityDuration;        
        var adjRate = baseRate/(incrementalFactor*baseDur/this.getDefaultActionDuration());

        this.setupOngoingActivity(function(p) {
                var preTile = p.digger.getMap().getTile(p.digX, p.digY, p.digZ);
                p.digger.getMap().dig(p.digger,p.digRate, p.digX, p.digY, p.digZ);
                var postTile = p.digger.getMap().getTile(p.digX, p.digY, p.digZ);
                p.digger.setOgaInterrupt(preTile.getName() != postTile.getName());
                p.digger.setLastActionDuration(p.digDur);
                p.digger.raiseEvent('onActed');
                p.digger.stepOgaCounter()
                Game.sendMessage(p.digger,'You are digging ('+p.digger.getOgaCounter()+') ...');
            },
            {digger: this, digRate: adjRate, digX: x, digY: y, digZ: z, digDur: incrementalActivityDuration},
            incrementalActivityDuration);
        
        this.setLastActionDuration(1);
    },
    getDigDuration: function() {
        var actionDurationMultiplier = 1;
        if (this.hasMixin('InventoryHolder')) {
            actionDurationMultiplier = this.getActionPenaltyFactor();
        }
        this.alertOnSlowness(actionDurationMultiplier);
        return this.getDefaultActionDuration()*3*actionDurationMultiplier;
    },
    listeners: {
        details: function() {
            return [{key: 'digging', value: this.getDigRate()}];
        },
        calcDetails: function() {
            return [{key: 'digRate', value: this.getDigRate()}];
        }
    }
}

Game.EntityMixins.FixedExperiencePoints = {
    name: 'FixedExperiencePoints',
    init: function(template) {
        // jump through some hoops to allow spec of 0 xp
        this._fixedXp = 1;
        if ('fixedXp' in template) {
            this._fixedXp = template['fixedXp'];
        }
    },
    getFixedXp: function() {
        return this._fixedXp;
    },
    setFixedXp: function(v) {
        this._fixedXp = v;
    },
}

Game.EntityMixins.NonRecuperatingDestructible = {
    name: 'NonRecuperatingDestructible',
    groupName: 'Destructible',
    init: function(template) {
        this._maxHp = template['maxHp'] || 10;
        // We allow taking in health from the template incase we want
        // the entity to start with a different amount of HP than the 
        // max specified.
        this._hp = template['hp'] || this._maxHp;
        this._defenseValue = template['defenseValue'] || 0;
    },
    getHp: function() {
        return this._hp;
    },
    getMaxHp: function() {
        return this._maxHp;
    },
    setHp: function(v) {
        this._hp = v;
    },
    setMaxHp: function(v) {
        this._maxHp = v;
    },
    increaseDefenseValue: function(value) {
        // If no value was passed, default to 2.
        value = value || 2;
        // Add to the defense value.
        this._defenseValue += value;
        Game.sendMessage(this, "You are tougher!");
    },
    increaseMaxHp: function(value) {
        // If no value was passed, default to 10.
        value = value || 10;
        // Add to both max HP and HP.
        this._maxHp += value;
        this._hp += value;
        Game.sendMessage(this, "You are healthier!");
    },
    getDefenseValue: function() {
        var modifier = 0;
        // If we can equip items, then have to take into 
        // consideration weapon and armor
        if (this.hasMixin(Game.EntityMixins.Equipper)) {
            var heldItem = this.getHolding();
            if (heldItem && heldItem.isWeapon()) {
                modifier += heldItem.getDefenseValue();
            }
            if (this.getWearing()) {
                modifier += this.getWearing().getDefenseValue();
            }
        }
        return this._defenseValue + modifier;
    },
    getExpValueFor: function(attacker) {
        if (this.hasMixin('FixedExperiencePoints')) {
            return this.getFixedXp();
        }
        
        var exp = this.getMaxHp()*.2 + this.getDefenseValue();

        if (this.hasMixin('Attacker')) {
            exp += this.getAttackValue();
        }

        var ratio = 1;
        // Account for level differences
        if (this.hasMixin('ExperienceGainer')) {
            if (attacker.hasMixin('ExperienceGainer')) {
                ratio = this.getLevel()/attacker.getLevel();
            } else {
                return 0;
            }
        } else {
            if (attacker.hasMixin('ExperienceGainer')) {
                ratio = 1/attacker.getLevel();
            } else {
                return 0;
            }
        }

        return 1+exp*ratio; // always at least 1 experience
    },
    takeDamage: function(attacker, damage) {
        damage = Math.max(0,damage); // no healing via negative damage!
        this._hp -= damage;
        this.setOgaInterrupt(true);
        // If have 0 or less HP, then remove ourseles from the map
        if (this._hp <= 0) {
            this.raiseEvent('onDeath', attacker);
            attacker.raiseEvent('onKill', this);
            this.kill(attacker);
        } else {
            this.raiseEvent('onDamaged', attacker);
        }
    },
    listeners: {
        onGainLevel: function() {
            // Heal the entity.
            this.setHp(this.getMaxHp());
        },
        details: function() {
            return [
                {key: 'defense', value: this.getDefenseValue()},
                {key: 'hp', value: this.getHp()}
            ];
        },
        calcDetails: function() {
            return [
                {key: 'defense', value: this.getDefenseValue()},
                {key: 'hp', value: this.getHp()}
            ];
        },
        onDeath: function() {
            if (this.hasMixin('PlayerActor')) {
                return;
            }

            var player = this.getMap().getPlayer();
            var newZ = Game.util.getRandomInteger(0,player.getZ()-1);
            if (player.getZ() == 0) {
                newZ = Game.util.getRandomInteger(2,4);
            }

            var entity = Game.RandomEntitiesByLevel[newZ].getOne();
            this.getMap().addEntityAtRandomPosition(entity, newZ);

            // Level up the entity based on the floor
            if (entity.hasMixin('ExperienceGainer')) {
                for (var level = Game.util.getRandomInteger(-1,1); level < newZ; level++) {
                    entity.giveExperience(entity.getNextLevelExperience() -
                        entity.getExperience());
                }
            }
            
            //console.log("death! new entity placed on "+newZ);
            //console.dir(entity);
//            var entity = Game.EntityRepository.createRandom();
//            this.getMap().addEntityAtRandomPosition(entity,newZ);
        }
    }
}

Game.EntityMixins.Destructible = Game.util.extendedObj(Game.EntityMixins.NonRecuperatingDestructible, {
    name: 'Destructible',
    groupName: 'Destructible',
    init: function(template) {
        Game.EntityMixins.NonRecuperatingDestructible.init.call(this,template);
        
        this._timeForFullRecuperation = template['timeForFullRecuperation'] || (this.getDefaultActionDuration() * 1000); // default is full recovery over 1000 turns
        this._healingTimeCounter = 0;
    },
    getTimePerHpHealed: function() {
        return this._timeForFullRecuperation / this.getMaxHp();
    },
    doRecuperation: function() {
        if (this._healingTimeCounter >= this.getTimePerHpHealed()) {
            this._hp++;
            this._healingTimeCounter -= this.getTimePerHpHealed();
            Game.sendMessage(this,'You feel a little bit better');
            this.raiseEvent('onRecuperated');
        }
    }
});   

Game.EntityMixins.Destructible.listeners.onActed= function() {
    if (this.getHp() == this.getMaxHp()) {
        this._healingTimeCounter = 0;
        return;
    }
    this._healingTimeCounter += this.getLastActionDuration();
    this.doRecuperation();
}

Game.EntityMixins.Destructible.listeners.onEat = function(foodItem) {
    if (this.getHp() == this.getMaxHp()) {
        return;
    }
    this._healingTimeCounter += foodItem.getFoodValue();
    this.doRecuperation();
}

// CSW NOTE : maybe expand/extend this to a stack and/or hash instead of a simple single-target model
Game.EntityMixins.Retaliator = {
    name: 'Retaliator',
    init: function(template) {
        this._retaliationTarget = '';
    },
    setRetaliationTarget: function(entity) {
        this._retaliationTarget = entity;
    },
    getRetaliationTarget: function() {
        return this._retaliationTarget;
    },
    listeners: {
        onKill: function(victim) {
            if (this.getRetaliationTarget() === victim) {
                this.setRetaliationTarget('');
            }
        },
        onDamaged: function(aggressor) {
            this.setRetaliationTarget(aggressor);
        }
    }    
}

Game.EntityMixins.Allier = {
    name: 'Allier',
    init: function(template) {
        this._allies = template['allies'] || [];
    },
    isAlliedWith: function(entity) {
        if (this._allies.indexOf(entity.getName()) > -1) {
            return true;
        }
        if (this._allies.indexOf(entity.getId()) > -1) {
            return true;
        }
        if (this._allies.indexOf(entity.getGroup()) > -1) {
            return true;
        }
        return false;
    },
    addAllyType: function(name) {
        if (this._allies.indexOf(name) < 0) {
            this._allies.push(name);
        }
    },
    removeAllyType: function(name) {
        var idx = this._allies.indexOf(name);
        if (idx > -1) {
            this._allies.splice(idx,1);
        }
    },
    addAllyIndividual: function(entity) {
        if (this._allies.indexOf(entity.getId()) < 0) {
            this._allies.push(entity.getId());
        }
    },
    removeAllyIndividual: function(entity) {
        var idx = this._allies.indexOf(entity.getId());
        if (idx > -1) {
            this._allies.splice(idx,1);
        }
    }
}


Game.EntityMixins.RangedAttacker = {
    name: 'RangedAttacker',
    groupName: 'Attacker',
    init: function(template) {
        this._rangedAttackValue = template['rangedAttackValue'] || 1;
    },
    getBaseRangedAttackValue: function(ammo) {
        return this._rangedAttackValue;
    },
    getRangedAttackValue: function(ammo) {
        var modifier = 0;
        // If we can equip items, then have to take into consideration launchers (if matched with approp ammo)
        if (ammo && ammo.hasMixin('Ammo')) {
            modifier += ammo.getRangedAttackDamageBonus();
        }
        
        var rangedAtk = this._rangedAttackValue + modifier;
        
        if (this.hasMixin('Equipper')) {
            var heldItem = this.getHolding();
            if (heldItem && heldItem.isWeapon()) {
                var weaponShootEffects = heldItem.raiseEvent('onShooting',ammo);

                var mults = Game.util.scanEventResultsFor(weaponShootEffects,'rangedAttackDamageMultiplier');
                for (var i=0;i<mults.length;i++) {
                    rangedAtk *= mults[i];
                }

                var adds = Game.util.scanEventResultsFor(weaponShootEffects,'rangedAttackDamageAdder');
                for (var i=0;i<adds.length;i++) {
                    rangedAtk += adds[i];
                }
            }
        }
        
        //console.log('rangedAtk: '+rangedAtk);
        
        return rangedAtk;
    },
    increaseRangedAttackValue: function(value) {
            // If no value was passed, default to 2.5
            value = value || 2.5;
            // Add to the attack value.
            this._rangedAttackValue += value;
            Game.sendMessage(this, "You have better aim!");
    },
    rangedAttack: function(target,ammo) {
        
        // Only hit the entity if they were attackable
        if (target.hasMixin('Destructible')) {
            var attack = this.getRangedAttackValue(ammo);
            var defense = target.getDefenseValue();
            
            var max = Math.max(1, attack - defense);
            var damage = 1 + Math.floor((.5 + ROT.RNG.getUniform()) * max);

            if (this.hasMixin('MessageRecipient')) {
                Game.sendMessage(this, 'You hit the %s with the %s for %d damage', 
                    [target.getName(), ammo.getName(), damage]);
                Game.refresh();
            }
            if (target.hasMixin('MessageRecipient')) {
                Game.sendMessage(target, 'The %s hits you with the %s for %d damage', 
                    [this.getName(), ammo.getName(), damage],'%b{#422}');
                Game.refresh();
            }

            var actionDurationMultiplier = 1;
            if (this.hasMixin('InventoryHolder')) {
                actionDurationMultiplier = this.getActionPenaltyFactor();
            }
            this.alertOnSlowness(actionDurationMultiplier);
            this.setLastActionDuration(this.getRangedAttackDuration()*actionDurationMultiplier);
            
            Game.sendMessageNearby(this.getMap(), this.getX(), this.getY(), this.getZ(),
                            'The %s hit the %s for %d damage',
                            [this.getName(), target.getName(), damage]);

            // CSW NOTE: figure out how to avoid double-messaging the player (or other message recipient)

            //console.log(vsprintf('The %s hit the %s for %d damage!',
            //                [this.getName(), target.getName(), damage]));
                            
            target.takeDamage(this, damage);
        }
    },
    getRangedAttackDuration: function() {
        return this.getRangedDuration();
    },
    listeners: {
        details: function() {
            return [{key: 'base ranged attack', value: this.getBaseRangedAttackValue()}];
        },
        calcDetails: function() {
            return [{key: 'baseRangedAttack', value: this.getBaseRangedAttackValue()}];
        }
    }
}


Game.EntityMixins.MeleeAttacker = {
    name: 'MeleeAttacker',
    groupName: 'Attacker',
    init: function(template) {
        this._attackValue = template['attackValue'] || 1;
    },
    getAttackValue: function() {
        var modifier = 0;
        // If we can equip items, then have to take into 
        // consideration weapon and armor
        if (this.hasMixin(Game.EntityMixins.Equipper)) {
            var heldItem = this.getHolding();
            if (heldItem && heldItem.isWeapon()) {
                modifier += heldItem.getAttackValue();
            }
            if (this.getWearing()) {
                modifier += this.getWearing().getAttackValue();
            }
        }
        return this._attackValue + modifier;
    },
    increaseAttackValue: function(value) {
            // If no value was passed, default to 2.
            value = value || 2;
            // Add to the attack value.
            this._attackValue += value;
            Game.sendMessage(this, "You are deadlier!");
    },
    attack: function(target) {
        // only can hit targets in melee range
        if (! Game.util.coordsAreAdjacent(this.getX(),this.getY(),target.getX(),target.getY())) {
            return false;
        }
        
        // Only hit the entity if they were attackable
        if (target.hasMixin('Destructible')) {
            var attack = this.getAttackValue();
            var defense = target.getDefenseValue();
            var max = Math.max(0, attack - defense);
            var damage = 1 + Math.floor(ROT.RNG.getUniform() * max);

            if (this.hasMixin('MessageRecipient')) {
                Game.sendMessage(this, 'You strike the %s for %d damage', 
                    [target.getName(), damage]);
            }
            if (target.hasMixin('MessageRecipient')) {
                Game.sendMessage(target, 'The %s strikes you for %d damage', 
                    [this.getName(), damage],'%b{#422}');
            }

            var actionDurationMultiplier = 1;
            if (this.hasMixin('InventoryHolder')) {
                actionDurationMultiplier = this.getActionPenaltyFactor();
            }
            this.alertOnSlowness(actionDurationMultiplier);
            this.setLastActionDuration(this.getAttackDuration()*actionDurationMultiplier);
            
            Game.sendMessageNearby(this.getMap(), this.getX(), this.getY(), this.getZ(),
                            'The %s hit the %s for %d damage',
                            [this.getName(), target.getName(), damage]);

            // CSW NOTE: figure out how to avoid double-messaging the player (or other message recipient)

            //console.log(vsprintf('The %s hit the %s for %d damage!',
            //                [this.getName(), target.getName(), damage]));
                            
            target.takeDamage(this, damage);
        }
    },
    getAttackDuration: function() {
        return this.getMeleeDuration();
    },
    listeners: {
        onDamaged: function(aggressor) {
            this._currentBehavior = Game.EntityBehaviors.MeleeAttackerBehavior;
        },
        details: function() {
            return [{key: 'attack', value: this.getAttackValue()}];
        },
        calcDetails: function() {
            return [{key: 'meleeAttack', value: this.getAttackValue()}];
        }
    }
}

Game.EntityMixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function(template) {
        this._messages = [];
        this._messageArchives = [];
        this._messageArchiveLimit = template['messageArchiveLimit'] || 1;
    },
    receiveMessage: function(message) {
        //this._messages.push(message);
        if (message != this._messages[0]) {
            this._messages.unshift(message);
        }
    },
    getMessages: function() {
        return this._messages;
    },
    getMessageArchives: function() {
        return this._messageArchives;
    },
    hasAnyMessages: function() {
        return this._messages.length > 0;
    },
    hasArchivedMessages: function() {
        return this._messageArchives.length > 0;
    },
    clearMessages: function() {
        this.raiseEvent('handleClearMessages');
    },
    resetMessages: function() {
        this._messages = [];
        this._messageArchives = [];
    },
    archiveMessage: function(msg) {
        if (this._messageArchives.length > this._messageArchiveLimit) {
             this._messageArchives.pop();
        }
        this._messageArchives.unshift(msg);
    },
    listeners: {
        onKill: function(victim) {
            message = vsprintf('You kill the %s!', [victim.getName()]);

            // CSW NOTE : hack to avoid double-messagin the player        
            if (! message.match(Game._player_name_match_pattern)) {
                this.receiveMessage(message);
            }
        },
        onGainLevel: function() {
            message = vsprintf("You advance to level %d.", [this.getLevel()]);

            // CSW NOTE : hack to avoid double-messagin the player        
            if (! message.match(Game._player_name_match_pattern)) {
                this.receiveMessage(message);
            }
        },
        handleClearMessages:  function() {
            this._messageArchives.pop(); // old messages are gradually cleared away

            // new ones are moved to the archive
            while (this._messages.length > 0) {
                this.archiveMessage(this._messages.pop());
            }
        }

    }
}

Game.EntityMixins.InventoryHolder = {
    name: 'InventoryHolder',
    init: function(template) {
        // Set up an empty inventory.
        this._itemHolder = new Game.Item({
            name: 'itemHolder',
            group: 'container',
            character: '?',
            foreground: '#fff',
            description: "internal item container used to implement InventoryHolder entity mixin",
            maxCarryWeight: -1,
            maxCarryBulk: -1,
            accessDuration: 1000, // how long it takes to get something out of or put something in this container
            mixins: [Game.ItemMixins.Container]
        });        
        this._itemHolder.setInvWeight(0);
        this._itemHolder.setInvBulk(0);

        this._weightCapacity = template['weightCapacity'] || 52000; // 52 kg (20 on earth, but mars is 38% of earth gravity); NOTE: this is a soft limit, up until 5x that amount
        this._bulkCapacity = template['bulkCapacity'] || 20000; // 20 liters
    },
    
    
    getWeightCapacity: function() {
        return this._weightCapacity;
    },
    setWeightCapacity: function(v) {
        this._weightCapacity = v;
    },
    increaseWeightCapacity: function(v) {
        this._weightCapacity += v;
    },
    getCurrentWeight: function() {
        var curWt = this._itemHolder.getInvWeight();
        if (this.hasMixin('Equipper')) {
            curWt += this.getEquippedWeight();
        }
        return curWt;
    },
    getWeightStatusString: function() {
        return (this.getCurrentWeight()/1000)+'/'+(this.getWeightCapacity()/1000)+' kg';
    },
    getWeightStatusColor: function() {
        return this.getSlownessColorMod(this.getActionPenaltyFactor());
    },

    getActionPenaltyFactor: function() {
        return Math.max(1,this.getCurrentWeight() / this.getWeightCapacity());
    },


    getBulkCapacity: function() {
        return this._bulkCapacity;
    },
    setBulkCapacity: function(v) {
        this._bulkCapacity = v;
    },
    increaseBulkCapacity: function(v) {
        this._bulkCapacity += v;
    },
    getCurrentBulk: function() {
        return this._itemHolder.getCurrentCarriedBulk();
    },
    getBulkStatusString: function() {
        return (this.getCurrentBulk()/1000)+'/'+(this.getBulkCapacity()/1000)+' L';
    },
    getBulkStatusColor: function() {
        return this._itemHolder.getBulkStatusColor();
    },

    getInvenLimitsSummary : function() {
        return this.getWeightStatusColor()+'mass: '+this.getWeightStatusString()+Game.Screen.DEFAULT_COLOR_SETTER+'       '+this.getBulkStatusColor()+'volume: '+this.getBulkStatusString()    
    },


    getItems: function() {
        if (this.hasMixin('Equipper')) {
            return this.getEquippedItems().concat(this._itemHolder.getItems());
        }
        return this._itemHolder.getItems();
    },
    getItem: function(i) {
        return (this._itemHolder.getItemsAt([i]))[0];
    },
    clearInventory: function() {
        var eqs = new Array();
        if (this.hasMixin('Equipper')) {
            eqs = this.getEquippedItems();
            this.clearAllEquipped();
        }
        return eqs.concat(this._itemHolder.extractAllItems());
    },
    forceAddItem: function(item) {
        return this._itemHolder.forceAddItems([item]);
    },
    addItem: function(item) {
        if (! this.canAddItem(item)) {
            return false;
        }
        return this._itemHolder.addItems([item]);
    },
    removeItem: function(i) {
        return this._itemHolder.extractItemsAt([i]);
    },
    
    
    canAddItem: function(itm) {
        return this.canAddItem_bulk(itm) && this.canAddItem_weight(itm);
    },
    canAddItem_bulk: function(itm) {
        return (itm.getInvBulk() + this.getCurrentBulk() <= this._bulkCapacity);
    },    
    canAddItem_weight: function(itm) {
        return (itm.getInvWeight() + this.getCurrentWeight() <= this._weightCapacity * 5);
    },
    isOverloaded_bulk: function() {
        return this.getCurrentBulk() > this._bulkCapacity;
    },
    isOverloaded_weight: function() {
        return this.getCurrentWeight() > this._weightCapacity * 5;
    },
    
    
    pickupItems: function(indicesOfMapList) {
        // Allows the user to pick up items from the map, where indices is
        // the indices for the array returned by map.getItemsAt
        var mapItems = this._map.getItemsAt(this.getX(), this.getY(), this.getZ());
        var added = 0;
        // Iterate through all indices.
        for (var i = 0; i < indicesOfMapList.length; i++) {
            // Try to add the item. If our inventory is not full, then splice the 
            // item out of the list of items. In order to fetch the right item, we
            // have to offset the number of items already added.
            if (this.addItem(mapItems[indicesOfMapList[i]  - added])) {
                mapItems.splice(indicesOfMapList[i] - added, 1);
                added++;
            } else {
                // Inventory is full
                break;
            }
        }

        // Update the map items
        this._map.setItemsAt(this.getX(), this.getY(), this.getZ(), mapItems);
        
        if (added > 0) {
            var actionDurationMultiplier = this.getActionPenaltyFactor();
            this.alertOnSlowness(actionDurationMultiplier);        
            this.setLastActionDuration(this.getDefaultActionDuration()*actionDurationMultiplier);
        }
        
        // Return true only if we added all items
        return added === indicesOfMapList.length;
    },
    dropAllInventory: function() {
        var allItems = this._itemHolder.extractAllItems();                    
        var eqs = new Array();
        if (this._map) {
            if (this.hasMixin('Equipper')) {
                eqs = this.getEquippedItems();
                this.dropAllEquipped();
            }
            for (var i=0; i<allItems.length; i++) {
                var item = allItems[i];
                this._map.addItem(this.getX(), this.getY(), this.getZ(), item);
                item.raiseEvent('onDropped',this._map,this.getX(), this.getY(), this.getZ());
            }
        }        
        return eqs.concat(allItems);
    },
    dropThisItem: function(itm) {
        var item = (this._itemHolder.extractItems([itm]))[0];
        if (this._map) {
            this._map.addItem(this.getX(), this.getY(), this.getZ(), item);
            item.raiseEvent('onDropped',this._map,this.getX(), this.getY(), this.getZ());
        }        
        return item;
    },
    dropItems: function(indices) {
        var numEquipped = 0;
        // handle special case of equipped items
        if (this.hasMixin('Equipper')) {
            var theEquipped = this.getEquippedItems();
            numEquipped = theEquipped.length;
            if (numEquipped > 0) {
                // cycle through indices passed in, and if the idx is < numEquipped, handle the equipment drop, else decrease the idx appropriately
                for (var i=0; i<indices.length; i++) {
                    if (indices[i] < numEquipped) {
                        if (theEquipped[indices[i]] == this.getHolding() && indices.length == 1) {
                            this.setLastActionDuration(50); // dropping something that's held in hands is FAST
                        }
                        this.dropEquippedByItem(theEquipped[indices[i]]);
                        // now that the equipped item is dropped, don't forget to REMOVE THAT INDEX FROM THE TO-DROP LIST!!!
                        indices.splice(i,1);
                        i--; // and decrement i so we don't skip an item in the next pass through the loop
                    } else {
                        indices[i] -= numEquipped;
                    }
                }
            }
        }
    
        
        var droppedItems = this._itemHolder.extractItemsAt(indices);       
        if (this._map) {
            for (var i=0; i<droppedItems.length; i++) {
                var item = droppedItems[i];
                this._map.addItem(this.getX(), this.getY(), this.getZ(), item);
                item.raiseEvent('onDropped',this._map,this.getX(), this.getY(), this.getZ());
            }
        }        
        return droppedItems;
    },
    extractThisItem: function(itm) {
        if (this.hasMixin('Equipper')) {
            if (this.removeEquippedByItem(itm)) {
                return itm;
            }
        }
        return (this._itemHolder.extractItems([itm]))[0];
    },
    getIndexOfItem: function(itm) {
        return (this._itemHolder.getIndicesOf([itm]))[0];
    },
    listeners: {
        destroyCarriedItem: function(itm) {
            if (this.hasMixin('Equipper')) {
                if (this.removeEquippedByItem(itm)) {
                    return itm;
                }
            }
            return (this._itemHolder.extractItems([itm]))[0];
        }
    }
};

// NOTE: an Equipper MUST also be an InventoryHolder
Game.EntityMixins.Equipper = {
    name: 'Equipper',
    init: function(template) {
        this._inHands = null;
        this._onBody = null;
    },
    getEquippedWeight: function() {
        var wt = 0;
        if (this._inHands) {
            wt += this._inHands.getInvWeight();
        }
        if (this._onBody) {
            wt += this._onBody.getInvWeight();
        }
        return wt;
    },
    getEquippedItems: function() {
        var items = new Array();
        if (this._inHands) {
            items.push(this._inHands);
        }
        if (this._onBody) {
            items.push(this._onBody);
        }
        return items;
    },
    removeEquippedByItem: function(itm) {
        if (itm == this._inHands) {
            this._inHands = null;
            return true;
        } else
        if (itm == this._onBody) {
            this._onBody = null;
            return true;
        }
        return false;
    },
    dropEquippedByItem: function(itm) {
        if (itm == this._inHands) {
            this._inHands = null;
            this.dropItemToMap(itm,false);
            return true;
        } else
        if (itm == this._onBody) {
            this._onBody = null;
            this.dropItemToMap(itm,false);
            return true;
        }
        return false;
    },
    dropAllEquipped: function() {
        if (this._inHands) {
            this.dropItemToMap(this._inHands,false);
            this._inHands = null;
        }
        if (this._onBody) {
            this.dropItemToMap(this._onBody,false);
            this._onBody = null;
        }
    },
    dropItemToMap: function(itm,flagTooMuch) {
        if (this._map) {
            this._map.addItem(this.getX(), this.getY(), this.getZ(), itm);
            itm.raiseEvent('onDropped',this._map,this.getX(), this.getY(), this.getZ());
            if (flagTooMuch) {
                Game.sendMessage(this,'%s was too large for you to stow - it had to be dropped',[itm.describeThe()]);
            }
        }
    },
    clearAllEquipped: function() {
        var eqs = this.getEquippedItems();
        this._inHands = null;
        this._onBody = null;
        return eqs;
    },
    holdInHands: function(item) {
        //console.log('called holdInHands');
        this.stowFromHands();
        if (item==this._onBody) { this._onBody = null; }
        this._inHands = item;
        var actionDurationMultiplier = this.getActionPenaltyFactor();
        this.alertOnSlowness(actionDurationMultiplier);        
        this.setLastActionDuration(this.getDefaultActionDuration()*actionDurationMultiplier);        
    },
    stowFromHands: function() {
        //console.log('called stowFromHands');
        if (this._inHands) {        
            var priorHeld = this._inHands;
            this._inHands = null;

            if (! this.addItem(priorHeld)) {
                this.dropItemToMap(priorHeld,true);
            } else {
                var actionDurationMultiplier = this.getActionPenaltyFactor();
                this.alertOnSlowness(actionDurationMultiplier);        
                this.setLastActionDuration(this.getDefaultActionDuration()*actionDurationMultiplier);        
            }
        }
    },
    wear: function(item) {
        //console.log('called wear');
        this.stowFromBody();
        if (item==this._inHands) { this._inHands = null; }
        this._onBody = item;
        var actionDurationMultiplier = this.getActionPenaltyFactor();
        this.alertOnSlowness(actionDurationMultiplier);        
        this.setLastActionDuration(this.getDefaultActionDuration()*5*actionDurationMultiplier); // putting on armor takes a while
    },
    stowFromBody: function() {
        //console.log('called stowFromBody');
        if (this._onBody) {        
            var prior = this._onBody;
            this._onBody = null;

            if (! this.addItem(prior)) {
                this.dropItemToMap(prior,true);
            } else {
                var actionDurationMultiplier = this.getActionPenaltyFactor();
                this.alertOnSlowness(actionDurationMultiplier);        
                this.setLastActionDuration(this.getDefaultActionDuration()*actionDurationMultiplier);        
            }
        }
    },
    getHolding: function() {
        return this._inHands;
    },
    getWearing: function() {
        return this._onBody;
    },
};


Game.EntityMixins.FoodConsumer = {
    name: 'FoodConsumer',
    init: function(template) {
        this._maxFullness = template['maxFullness'] || 1000;
        // Start halfway to max fullness if no default value
        this._fullness = template['fullness'] || (Math.floor(this._maxFullness *.7));
        // Number of points to decrease fullness by every turn.
        this._fullnessDepletionRate = template['fullnessDepletionRate'] || 1;
        this._consumeBulk = template['consumeBulk'] || 35;  // ml eaten per 'E'at action
    },
    getConsumeBulk: function() {
        return this._consumeBulk;
    },
    setConsumeBulk: function(v) {
        this._consumeBulk = v;
    },
    doTurnHunger: function() {
        // Remove the standard depletion points
        var hungerAmt = this._fullnessDepletionRate*(this.getLastActionDuration()/this.getDefaultActionDuration());
        this.modifyFullnessBy(-hungerAmt);
   //     console.log("hungerAmt = "+hungerAmt);
   //     console.log("current fullness: "+this._fullness);
        //hungerAmt = 1; // DEV
    },
    modifyFullnessBy: function(points) {
   //     console.log("player fullness change: "+points);
        var preHungerState = this.getHungerState();
        this._fullness = this._fullness + points;
        var postHungerState = this.getHungerState();
        if (this.getOgaActivity() && ! this.getOgaInterrupt() && (preHungerState != postHungerState)) {
            this.setOgaInterrupt(true);
        }
        if (preHungerState != postHungerState) {
            if (! postHungerState) {
                Game.sendMessage(this,"%b{#444}You are no longer "+preHungerState);
            } else {
                Game.sendMessage(this,"%b{#444}You are "+postHungerState);
            }
        }
        
        if (this._fullness <= 0) {
            this.kill({},"You have died of starvation!");
        } else if (this._fullness > this._maxFullness) {
            Game.sendMessage(this,"You're so full that you're choking!");
            this.takeDamage(this,Math.floor(this._maxHp*.01)+1);
        }
    },
    getHungerState: function() {
        // Fullness points per percent of max fullness
        var perPercent = this._maxFullness / 100;
        // 5% of max fullness or less = starving
        if (this._fullness <= 0) {
            return '%c{black}%b{red}!! D E A D !!';
        } else if (this._fullness <= perPercent * 5) {
            return '%c{black}%b{red}*Starving*';
        } else if (this._fullness <= perPercent * 10) {
            return '%c{red}Very Hungry';
        // 25% of max fullness or less = hungry
        } else if (this._fullness <= perPercent * 25) {
            return '%c{orange}Hungry';
        } else if (this._fullness <= perPercent * 50) {
            return 'Peckish';
        // 100+% of max fullness or more = overstuffed
        } else if (this._fullness >= this._maxFullness) {
            return '%c{red}*Overstuffed*';
        // 95% of max fullness or more = oversatiated
        } else if (this._fullness >= perPercent * 95) {
            return '%c{yellow}Stuffed';
        // 75% of max fullness or more = full
        } else if (this._fullness >= perPercent * 75) {
            return '%c{green}Full';
        // 75% of max fullness or more = full
        // Anything else = not hungry
        } else {
            return '';
        }
    },
    eat: function(foodItem) {
//    - entity has eatAmount - how many L the entity eats per 'E'at activity (typically 35 ml for humans)
//    - item has nutritional density, which is food value per L
//    - on 'E'at of an item - 
//        if (item bulk > eatAmount) food value eaten = eatAmount * nutritional density; increase satiation by food value, and reduce item bulk by eatAmount
//        else if (item bulk <= eatAmount) increase satiation by item bulk * nutritional density, then destroy item
        var entConsumeBulk = this.getConsumeBulk();
        this.raiseEvent('consumingItem',foodItem);
        
        var incrementalActivityDuration = 50; // twenty eats per typical turn duration CSW NOTE: will need to generalize speed scaling to handle this kind of thing...
        
        this.setupOngoingActivity(function(p) {
                var consumedFoodValue = 0;
                if ((p.eaten._invBulk) > p.eatBulk) {
                    p.eaten._invWeight = Math.round(p.eaten._invWeight * (p.eaten._invBulk - p.eatBulk) / p.eaten._invBulk);
                    p.eaten._invBulk -= p.eatBulk;
                    consumedFoodValue = p.eatBulk * p.eaten._foodDensity / 1000; // scale for ml -> L
                    //console.log('You are eating... ('+p.eater.getOgaCounter()+') ...');
                    Game.sendMessage(p.eater,'You are eating... ('+p.eater.getOgaCounter()+') ...');
                } else {
                    consumedFoodValue = p.eaten._invBulk * p.eaten._foodDensity / 1000; // scale for ml -> L
                    p.eaten._invBulk = 0;
                    if (! this.getMap().removeItem(p.eaten,this.getX(),this.getY(),this.getZ())) {
                        p.eaten.raiseEvent('onEatenBy',this);
                        Game.sendMessage(p.eater,'You finish '+p.eaten.describeThe());
                        Game.refresh();
                        this.raiseEvent('destroyCarriedItem',p.eaten);
                    }
                    this.setOgaInterrupt(true);
                }
                
                //console.log('modifyFullnessBy('+(consumedFoodValue+.05)+')');
                this.modifyFullnessBy(consumedFoodValue+.05); // extra .05 negates the food consumed in the time used to eat - entities do not get hungrier while eating (this is tied to activityDuration)


                p.eater.setLastActionDuration(p.eatDur);
                p.eater.raiseEvent('onActed');
                p.eater.stepOgaCounter()
//                Game._aux_screen_message.refresh();
            },
            {eater: this, eaten: foodItem, eatBulk: entConsumeBulk, eatDur: incrementalActivityDuration},
            incrementalActivityDuration);
            
            this.setLastActionDuration(1);
    },
    listeners: {
        onActed: function() {
            this.doTurnHunger();  
        },
        onRecuperated: function() {
            this.modifyFullnessBy(-this._fullnessDepletionRate);
        },
        consumingItem: function(foodItem) {
            Game.sendMessage(this, "You eat %s.", [foodItem.describeThe()]);
        }
    }
};


Game.EntityMixins.CorpseDropper = {
    name: 'CorpseDropper',
    init: function(template) {
        // Chance of dropping a cropse (out of 100).
        this._corpseDropRate = template['corpseDropRate'] || 100;
        this._corpseName = template['corpseName'] || (this._name + ' corpse');
        this._corpseDescription = template['corpseDescription'] || '';
        this._corpseFoodValue = template['corpseFoodValue'] || 0;
        this._corpseFoodDensityFactor = template['corpseFoodDensityFactor'] || 1;
        this._corpseSizeFactor = template['corpseSizeFactor'] || Game.util.getRandomInteger(450,550);
    },
    getCorpseFoodValue: function() {
        return this._corpseFoodValue;
    },
    setCorpseFoodValue: function(v) {
        this._corpseFoodValue = v;
    },
    adjustCorpseFoodValue: function(delta) {
        this._corpseFoodValue += delta;
    },
    listeners: {
        onDeath: function(attacker) {
            // Check if we should drop a corpse.
            if (Math.round(ROT.RNG.getUniform() * 100) <= this._corpseDropRate) {
                // Create a new corpse item and drop it.
                var newCorpse;
                if (Game.ItemRepository.has(this._corpseName)) {
                    newCorpse = Game.ItemRepository.create(this._corpseName);
                } else {
                    newCorpse = Game.ItemRepository.create('corpse', {
                        name: this._corpseName,
                        foreground: this._foreground,
                        invWeight:  Math.floor(this._corpseSizeFactor*(this.getMaxHp() + Game.util.getRandomInteger(0,5))),
                        invBulk: Math.floor(this._corpseSizeFactor*((this.getMaxHp()*.8) + Game.util.getRandomInteger(0,5))),
                        foodValue: this._corpseFoodValue
                    });

                    if (this._corpseDescription) {
                        newCorpse.setDescription(this._corpseDescription);
                    }
                    //console.dir(newCorpse);
                }
                if (this.getGroup()) {
                    newCorpse.setGroup(this.getGroup()+' corpse');
                }
                //console.dir(newCorpse);

                if (this.hasMixin('Destructible') && newCorpse.hasMixin('Edible')) {
                    var origFoodValue = newCorpse.getFoodValue();
                    var hpModForFoodValue = Game.util.getRandomInteger(Math.floor(this.getMaxHp()*.25),Math.floor(this.getMaxHp()*.75));
                    var modFactor = (hpModForFoodValue + origFoodValue) / origFoodValue;
                    newCorpse.modifyInvBulkByFactor(modFactor);
                    if (this._corpseFoodDensityFactor != 1) {
                        newCorpse.increaseFoodDensityByFactor(this._corpseFoodDensityFactor);
                    }
                //console.dir(newCorpse);
                }
                this._map.addItem(this.getX(), this.getY(), this.getZ(),newCorpse);
            }    
        }
    }
};

Game.EntityMixins.LootDropperSimple = {
    name: 'LootDropperSimple',
    group: 'LootDropper',
    init: function(template) {
        this._lootDropChecks = template['lootDropChecks'] || [1];
        this._lootDropOptions = template['lootDropOptions'] || [];
    },
    listeners: {
        onDeath: function(attacker) {
            for (var i=0; i<this._lootDropChecks.length; i++) {
                if (ROT.RNG.getUniform() <= this._lootDropChecks[i]) {
                    var lootName = this._lootDropOptions.random();
                    if (Game.ItemRepository.has(lootName)) {
                        this._map.addItem(this.getX(), this.getY(), this.getZ(), Game.ItemRepository.create(lootName));
                    }
                }
            }
        }
    }
};

Game.EntityMixins.SuicideSpawner = {
    name: 'SuicideSpawner',
    init: function(template) {
        this._suicideSpawnRate = template['suicideSpawnRate'] || 100;
        this._suicideSpawnEntityName = template['suicideSpawnEntityName'] || '';
    },
    listeners: {
        onSuicide: function(attacker) {
            // Check if we should spawn a new entity
            if ((this._suicideSpawnEntityName) && (Math.round(ROT.RNG.getUniform() * 100) <= this._suicideSpawnRate)) {
                var entity = Game.EntityRepository.create(this._suicideSpawnEntityName);
                var oX = this.getX();
                var oY = this.getY();
                var oZ = this.getZ();
                var conflictEntity = this.getMap().getEntityAt(oX,oY,oZ);
                if (conflictEntity && conflictEntity.getId() == this.getId()) {
                    this.getMap().removeEntity(this);
                    entity.setPosition(oX,oY,oZ);
                    entity.raiseEvent('onSpawned',[oZ-1,oZ].random());
                    this.getMap().addEntity(entity);
                } else if (! conflictEntity) {
                    entity.setPosition(oX,oY,oZ);
                    entity.raiseEvent('onSpawned',[oZ-1,oZ].random());
                    this.getMap().addEntity(entity);
                }
            }    
        }
    }
};

Game.EntityMixins.DamageAwakener = {
    name: 'DamageAwakener',
    groupName: 'Awakener',
    init: function(template) {
        this._awakenPercentRate = template['awakenPercentRate'] || 5;
        this._awakenSpawnEntityName = template['awakenSpawnEntityName'] || '';
    },
    listeners: {
        onDamaged: function(attacker) {
            if ((this._awakenSpawnEntityName) && (Math.round(ROT.RNG.getUniform() * 100) <= this._awakenPercentRate)) {
                this.raiseEvent('onAwaken');
            }
        },
        onAwaken: function() {
            // Check if we can spawn a new entity
            if (this._awakenSpawnEntityName) {
                var entity = Game.EntityRepository.create(this._awakenSpawnEntityName);
                var oX = this.getX();
                var oY = this.getY();
                var oZ = this.getZ();
                var conflictEntity = this.getMap().getEntityAt(oX,oY,oZ);
                if (conflictEntity && conflictEntity.getId() == this.getId()) {
                    this.getMap().removeEntity(this);
                    entity.setPosition(oX,oY,oZ);
                    entity.raiseEvent('onSpawned',[oZ-1,oZ].random());
                    this.getMap().addEntity(entity);
                } else if (! conflictEntity) {
                    entity.setPosition(oX,oY,oZ);
                    entity.raiseEvent('onSpawned',[oZ-1,oZ].random());
                    this.getMap().addEntity(entity);
                }
            }    
        }
    }
};

Game.EntityMixins.AutoDegrader = {
    name: 'AutoDegrader',
    init: function(template) {
        this._degradeRate = template['degradeRate'] || 10;
    },
    listeners: {
        onActed: function() {
            // Check if we should spawn a new entity
            if ((Math.round(ROT.RNG.getUniform() * 100) <= this._degradeRate)) {
                this.takeDamage(this,1);
            }    
        }
    }
};

Game.EntityMixins.Suicider = {
    name: 'Suicider',
    init: function(template) {
        this._suicideThreshhold = template['suicideThreshhold'] || .1;
    },
    listeners: {
        onActed: function() {
            if (this.getHp() > 0 && this.getHp() <= this.getMaxHp()*this._suicideThreshhold) {
                this.raiseEvent('onSuicide');
            }
        }
    }
};




Game.EntityMixins.ExperienceGainer = {
    name: 'ExperienceGainer',
    init: function(template) {
        this._level = 1;
        
        this._experience = template['experience'] || 0;
        this._statPointsPerLevel = template['statPointsPerLevel'] || 3;
        this._statPoints = 0;
        // Determine what stats can be levelled up.
        this._statOptions = [];
        
        if (this.hasMixin('MeleeAttacker')) {
            this._statOptions.push(['Increase attack value', this.increaseAttackValue]);
        }
        if (this.hasMixin('RangedAttacker')) {
            this._statOptions.push(['Increase ranged attack value', this.increaseRangedAttackValue]);
        }
        if (this.hasMixin('Destructible')) {
            this._statOptions.push(['Increase defense value', this.increaseDefenseValue]);   
            this._statOptions.push(['Increase max health', this.increaseMaxHp]);
        }
        if (this.hasMixin('Digger') && this.hasMixin('PlayerActor')) {
            this._statOptions.push(['Increase digging ability', this.increaseDigRate]);
        }
        if (this.hasMixin('Seer')) {
            this._statOptions.push(['Increase sight range', this.increaseSightRadius]);
        }
        
        if (template['level'] > 1) {
            this.levelUpTo(template['level']);
        }
    },
    getLevel: function() {
        return this._level;
    },
    getExperience: function() {
        return this._experience;
    },
    getNextLevelExperience: function() {
        if (this.hasMixin('PlayerActor')) {
            return (1 + (this._level + 1) * this._level) * 10;
        }
        return 10 + (((this._level - 1) * this._level) * 10); // mobs progress much faster!
    },
    getStatPoints: function() {
        return this._statPoints;
    },
    setStatPoints: function(statPoints) {
        this._statPoints = statPoints;
    },
    getStatOptions: function() {
        return this._statOptions;
    },
    levelUpTo: function(toLevel) {
        var targetLevel = toLevel || 0;
        //console.log('leveling '+this.getName()+' up to '+targetLevel);
        //var foo = 1;
        while (this.getLevel() < targetLevel) {
            //console.dir(this);
            //console.log('   current level: '+this.getLevel());
            this.giveExperience(this.getNextLevelExperience() - this.getExperience());
            //console.log('   new level: '+this.getLevel());
            //console.log('   ---');
        }
    },
    giveExperience: function(points) {
        var statPointsGained = 0;
        var levelsGained = 0;
        // Loop until we've allocated all points.
        while (points > 0) {
            // Check if adding in the points will surpass the level threshold.
            if (this._experience + points >= this.getNextLevelExperience()) {
                // Fill our experience till the next threshold.
                var usedPoints = this.getNextLevelExperience() - this._experience;
                points -= usedPoints;
                this._experience += usedPoints;
                // Level up our entity!
                this._level++;
                levelsGained++;
                this._statPoints += this._statPointsPerLevel;
                statPointsGained += this._statPointsPerLevel;
            } else {
                // Simple case - just give the experience.
                this._experience += points;
                points = 0;
            }
        }
        
        // Check if we gained at least one level.
        if (levelsGained > 0) {
            //console.log('raising onGainLevel');
            this.raiseEvent('onGainLevel');
        }
    },
    listeners: {
        onKill: function(victim) {
            var exp = victim.getExpValueFor(this);
            if (exp > 0) {
                this.giveExperience(exp);
                //console.log(this.getName()+' got '+exp+' xp for killing '+victim.getName());
            }
        },
        details: function() {
            return [{key: 'level', value: this.getLevel()}];
        },
        calcDetails: function() {
            return [{key: 'level', value: this.getLevel()}];
        },
        onSpawned: function(startLevel) {
            this.levelUpTo(startLevel);
        },
        onGainLevel: function() { 
            // if monster gets too high a level, put it deeper down and replace it with a new random thing
            if (this.hasMixin('PlayerActor')) {
                return;
            }
                        
            // if not already at bottom level, and if entity level > current dungeon depth + 1 (z is 0-based), then descend and replace
            var map = this.getMap();
            if (map) {
                var player = map.getPlayer();
                if ((this.getZ() < map.getDepth() -1) && (this.getLevel() > this.getZ()+2)) {
                    var newZ = this.getZ()+1;
                    if (((this.getZ() != player.getZ()) && (newZ != player.getZ())) || // not on level tied to the player
                        ((Math.abs(this.getX()-player.getX()) > player.getSightRadius()) || (Math.abs(this.getY()-player.getY()) > player.getSightRadius())) // out of sight range
                       ) {
                        var oldX = this.getX();
                        var oldY = this.getY();
                        var oldZ = this.getZ();

                        console.log(this.getName()+' is descending!');
                        console.dir(this);

                        // this descends
                        var position = map.getRandomWalkablePosition(newZ);
                        if (newZ == player.getZ()) {
                            while (((Math.abs(position.x-player.getX()) <= player.getSightRadius()) && (Math.abs(position.y-player.getY()) <= player.getSightRadius()))) {
                                position = map.getRandomWalkablePosition(newZ);
                            }
                        }
                        this.setPosition(position.x,position.y,newZ);


                        // add replacement
                        var entity = Game.EntityRepository.createRandom();
                        entity.setPosition(oldX,oldY,oldZ);
                        if (entity.hasMixin('ExperienceGainer')) {
                            entity.levelUpTo(oldZ);
                        }
                        map.addEntity(entity);
                        
                        console.log(entity.getName()+' added to replace');
                        console.dir(entity);

                    }
                }
            }
        }
    }
};

// ...
Game.EntityMixins.RandomStatGainer = {
    name: 'RandomStatGainer',
    groupName: 'StatGainer',
    listeners: {
        onGainLevel: function() {
            //console.log('RandomStatGainer leveling');
            var statOptions = this.getStatOptions();
            // Randomly select a stat option and execute the callback for each
            // stat point.
            while (this.getStatPoints() > 0) {
                // Call the stat increasing function with this as the context.
                statOptions.random()[1].call(this);
                this.setStatPoints(this.getStatPoints() - 1);
            }
        }
    }
};

Game.EntityMixins.PlayerStatGainer = {
    name: 'PlayerStatGainer',
    groupName: 'StatGainer',
    listeners: {
        onGainLevel: function() {
            // Setup the gain stat screen and show it.
            Game.Screen.gainStatScreen.setup(this);
            Game.Screen.playScreen.setSubScreen(Game.Screen.gainStatScreen);
        }
    }
};
