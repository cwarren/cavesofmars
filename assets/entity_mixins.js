Game._player_name_match_pattern = new RegExp('\\bplayer\\b','i');

Game.sendMessage = function(recipient, message, args) {
    // Make sure the recipient can receive the message 
    // before doing any work.
    if (recipient && recipient.hasMixin(Game.EntityMixins.MessageRecipient)) {
        // If args were passed, then we format the message, else
        // no formatting is necessary
        if (args) {
            message = vsprintf(message, args);
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
            this._sightRadius * this._sightRadius) {
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

            var w = this.getWeapon();
            if (w) {
                digMults = digMults.concat(Game.util.scanEventResultsFor(w.raiseEvent('onDigging'),'digMultiplier'));
                digAdds = digAdds.concat(Game.util.scanEventResultsFor(w.raiseEvent('onDigging'),'digAdder'));
            }

            var a = this.getArmor();
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
        // If no value was passed, default to 2.
        value = value || 3;
        // Add to the defense value.
        this._digRate += value;
        Game.sendMessage(this, "You are a better digger!");
    },
    digAt: function(x,y,z) {
        this.getMap().dig(this,this.getDigRate(), x, y, z);
        this.setLastActionDuration(this.getDigDuration());
    },
    getDigDuration: function() {
        return this.getDefaultActionDuration()*3;
    },
    listeners: {
        details: function() {
            return [{key: 'digRate', value: this.getDigRate()}];
        }
    }
}


Game.EntityMixins.NonRecuperatingDestructible = {
    name: 'NonRecuperatingDestructible',
    group: 'Destructible',
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
            if (this.getWeapon()) {
                modifier += this.getWeapon().getDefenseValue();
            }
            if (this.getArmor()) {
                modifier += this.getArmor().getDefenseValue();
            }
        }
        return this._defenseValue + modifier;
    },
    getExpValueFor: function(attacker) {
        var exp = this.getMaxHp() + this.getDefenseValue();

        if (this.hasMixin('Attacker')) {
            exp += this.getAttackValue();
        }

        // Account for level differences
        if (this.hasMixin('ExperienceGainer')) {
            if (attacker.hasMixin('ExperienceGainer')) {
                exp -= (attacker.getLevel() - this.getLevel()) * 3;
            } else {
                return 0;
            }
        } else {
            if (attacker.hasMixin('ExperienceGainer')) {
                exp -= attacker.getLevel();
            } else {
                return 0;
            }
        }
        
//        return Math.max(1,exp); // always at least 1 experience
        return exp; // always at least 1 experience
    },
    takeDamage: function(attacker, damage) {
        damage = Math.max(0,damage); // no healing via negative damage!
        this._hp -= damage;
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
        onDeath: function() {
            if (this.hasMixin('PlayerActor')) {
                return;
            }

            var player = this.getMap().getPlayer();
            if (player.getZ() == 0) {
                return;
            }
            var newZ = Game.util.getRandomInteger(0,player.getZ()-1);
            
            var entity = Game.EntityRepository.createRandom();
            this.getMap().addEntityAtRandomPosition(entity,newZ);
        }
    }
}

Game.EntityMixins.Destructible = Game.util.extendedObj(Game.EntityMixins.NonRecuperatingDestructible, {
    name: 'Destructible',
    group: 'Destructible',
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
    getRangedAttackValue: function(ammo) {
        var modifier = 0;
        // If we can equip items, then have to take into consideration launchers (if matched with approp ammo)
        //if (this.hasMixin(Game.EntityMixins.Equipper)) {
        //    if (this.getLauncher()) {
        //        modifier += this.getLauncher().getRangedAttackValue();
        //    }
        //}
        return this._rangedAttackValue + modifier;
    },
    increaseRangedAttackValue: function(value) {
            // If no value was passed, default to 1.
            value = value || 4;
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
            var damage = 1 + Math.floor((.3 + ROT.RNG.getUniform()*.7) * max);

            if (this.hasMixin('MessageRecipient')) {
                Game.sendMessage(this, 'You hit the %s with the %s for %d damage', 
                    [target.getName(), ammo.getName(), damage]);
                Game.refresh();
            }
            if (target.hasMixin('MessageRecipient')) {
                Game.sendMessage(target, 'The %s hits you with the %s for %d damage', 
                    [this.getName(), ammo.getName(), damage]);
                Game.refresh();
            }

            this.setLastActionDuration(this.getRangedAttackDuration());
            
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
//        onDamaged: function(aggressor) {
//            this._currentBehavior = Game.EntityBehaviors.MeleeAttackerBehavior;
//        },
        details: function() {
            return [{key: 'ranged attack', value: this.getRangedAttackValue()}];
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
            if (this.getWeapon()) {
                modifier += this.getWeapon().getAttackValue();
            }
            if (this.getArmor()) {
                modifier += this.getArmor().getAttackValue();
            }
        }
        return this._attackValue + modifier;
    },
    increaseAttackValue: function(value) {
            // If no value was passed, default to 2.
            value = value || 2;
            // Add to the attack value.
            this._attackValue += value;
            Game.sendMessage(this, "You are stronger!");
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
                    [this.getName(), damage]);
            }

            this.setLastActionDuration(this.getAttackDuration());
            
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
        }
    }
}

Game.EntityMixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function(template) {
        this._messages = [];
    },
    receiveMessage: function(message) {
        this._messages.push(message);
    },
    getMessages: function() {
        return this._messages;
    },
    hasAnyMessages: function() {
        return this._messages.length > 0;
    },
    clearMessages: function() {
        this._messages = [];
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


            //Game.sendMessage(this, "You advance to level %d.", [this._level]);
        }

    }
}

Game.EntityMixins.InventoryHolder = {
    name: 'InventoryHolder',
    init: function(template) {
        // Default to 10 inventory slots.
        var inventorySlots = template['inventorySlots'] || 10;
        // Set up an empty inventory.
        this._items = new Array(inventorySlots);
    },
    getItems: function() {
        return this._items;
    },
    getItem: function(i) {
        return this._items[i];
    },
    // CSW NOTE : modify additem and remove item to collapse inventory tags rather than having gaps in label (e.g. abc - b = ab, not ac)
    addItem: function(item) {
        // Try to find a slot, returning true only if we could add the item.
        for (var i = 0; i < this._items.length; i++) {
            if (!this._items[i]) {
                this._items[i] = item;
                return true;
            }
        }
        return false;
    },
    removeItem: function(i) {
        // If we can equip items, then make sure we unequip the item we are removing.
        if (this._items[i] && this.hasMixin(Game.EntityMixins.Equipper)) {
            this.unequip(this._items[i]);
        }
        // Simply clear the inventory slot.
        this._items[i] = null;
    },
    canAddItem: function() {
        // Check if we have an empty slot.
        for (var i = 0; i < this._items.length; i++) {
            if (!this._items[i]) {
                return true;
            }
        }
        return false;
    },
    pickupItems: function(indices) {
        // Allows the user to pick up items from the map, where indices is
        // the indices for the array returned by map.getItemsAt
        var mapItems = this._map.getItemsAt(this.getX(), this.getY(), this.getZ());
        var added = 0;
        // Iterate through all indices.
        for (var i = 0; i < indices.length; i++) {
            // Try to add the item. If our inventory is not full, then splice the 
            // item out of the list of items. In order to fetch the right item, we
            // have to offset the number of items already added.
            if (this.addItem(mapItems[indices[i]  - added])) {
                mapItems.splice(indices[i] - added, 1);
                added++;
            } else {
                // Inventory is full
                break;
            }
        }
        // Update the map items
        this._map.setItemsAt(this.getX(), this.getY(), this.getZ(), mapItems);
        
        if (added > 0) {
            this.setLastActionDuration(this.getDefaultActionDuration());
        }
        
        // Return true only if we added all items
        return added === indices.length;
    },
    dropItem: function(i) {
        // Drops an item to the current map tile
        if (this._items[i]) {
            if (this._map) {
                this._map.addItem(this.getX(), this.getY(), this.getZ(), this._items[i]);
            }
            this.removeItem(i);
            this.setLastActionDuration(this.getDefaultActionDuration());
        }
    }
};


Game.EntityMixins.FoodConsumer = {
    name: 'FoodConsumer',
    init: function(template) {
        this._maxFullness = template['maxFullness'] || 1000;
        // Start halfway to max fullness if no default value
        this._fullness = template['fullness'] || (Math.floor(this._maxFullness *.7));
        // Number of points to decrease fullness by every turn.
        this._fullnessDepletionRate = template['fullnessDepletionRate'] || 1;
    },
    doTurnHunger: function() {
        // Remove the standard depletion points
        var hungerAmt = this._fullnessDepletionRate*(this.getLastActionDuration()/this.getDefaultActionDuration());
        this.modifyFullnessBy(-hungerAmt);
    },
    modifyFullnessBy: function(points) {
        // console.log("player fullness change: "+points);
        this._fullness = this._fullness + points;
        
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
        if (this._fullness <= perPercent * 5) {
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
    listeners: {
        onActed: function() {
            this.doTurnHunger();  
        },
        onRecuperated: function() {
            this.modifyFullnessBy(-this._fullnessDepletionRate);
        }
    }
};


Game.EntityMixins.CorpseDropper = {
    name: 'CorpseDropper',
    init: function(template) {
        // Chance of dropping a cropse (out of 100).
        this._corpseDropRate = template['corpseDropRate'] || 100;
        this._corpseName = template['corpseName'] || (this._name + ' corpse');
        this._corpseFoodValue = template['corpseFoodValue'] || 0;
    },
/*
    tryDropCorpse: function(corpse_name) {
        if (Math.round(Math.random() * 100) <= this._corpseDropRate) {

            // Create a new corpse item and drop it.
            var newCorpse = Game.ItemRepository.create('corpse', {
                    name: this._corpseName,
                    foreground: this._foreground,
                });
            if (this._corpseFoodValue) {
                newCorpse.setFoodValue(this._corpseFoodValue);
            }
            this._map.addItem(this.getX(), this.getY(), this.getZ(),newCorpse);
        }
    },
*/
    listeners: {
        onDeath: function(attacker) {
            // Check if we should drop a corpse.
            if (Math.round(ROT.RNG.getUniform() * 100) <= this._corpseDropRate) {
                // Create a new corpse item and drop it.
                var newCorpse = Game.ItemRepository.create('corpse', {
                    name: this._corpseName,
                    foreground: this._foreground,
                    foodValue: this._corpseFoodValue
                });
                if (this.getGroup()) {
                    newCorpse.setGroup(this.getGroup()+' corpse');
                }
                this._map.addItem(this.getX(), this.getY(), this.getZ(),newCorpse);
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
                    this.getMap().addEntity(entity);
                } else if (! conflictEntity) {
                    entity.setPosition(oX,oY,oZ);
                    this.getMap().addEntity(entity);
                }
            }    
        }
    }
};

Game.EntityMixins.DamageAwakener = {
    name: 'DamageAwakener',
    group: 'Awakener',
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
                    this.getMap().addEntity(entity);
                } else if (! conflictEntity) {
                    entity.setPosition(oX,oY,oZ);
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


Game.EntityMixins.Equipper = {
    name: 'Equipper',
    init: function(template) {
        this._weapon = null;
        this._armor = null;
    },
    wield: function(item) {
        this._weapon = item;
        this.setLastActionDuration(this.getDefaultActionDuration());
    },
    unwield: function() {
        this._weapon = null;
        this.setLastActionDuration(this.getDefaultActionDuration());
    },
    wear: function(item) {
        this._armor = item;
        this.setLastActionDuration(this.getDefaultActionDuration());
    },
    takeOff: function() {
        this._armor = null;
        this.setLastActionDuration(this.getDefaultActionDuration());
    },
    getWeapon: function() {
        return this._weapon;
    },
    getArmor: function() {
        return this._armor;
    },
    unequip: function(item) {
        // Helper function to be called before getting rid of an item.
        if (this._weapon === item) {
            this.unwield();
        }
        if (this._armor === item) {
            this.takeOff();
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
/*    
    onGainLevel: function() {
        var statOptions = this.getStatOptions();
        // Randomly select a stat option and execute the callback for each
        // stat point.
        while (this.getStatPoints() > 0) {
            // Call the stat increasing function with this as the context.
            statOptions.random()[1].call(this);
            this.setStatPoints(this.getStatPoints() - 1);
        }
    }
*/
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
/*
    onGainLevel: function() {
        // Setup the gain stat screen and show it.
        Game.Screen.gainStatScreen.setup(this);
        Game.Screen.playScreen.setSubScreen(Game.Screen.gainStatScreen);
    }
*/
};

////////////////////////////////////////////////////////////////
// BEHAVIORS

Game.EntityBehaviors = {};

// this only move to empty floor spaces
Game.EntityBehaviors.PeacefulWanderBehavior = {
    name: 'PeacefulWanderBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {
        var neighbors = Game.util.coordsNeighboring(actor.getX(),actor.getY());
        var moveTarget = neighbors.random();
        var map = actor.getMap();
        //console.dir(map);
        var attemptLimiter = 8;
        while (attemptLimiter > 0 && ! map.isWalkable(moveTarget.x, moveTarget.y, actor.getZ())) {
            moveTarget = neighbors.random();
            attemptLimiter--;
        }
        if (attemptLimiter > 0) {
            actor.tryMove(moveTarget.x, moveTarget.y, actor.getZ());
        }
        
        return this;
    }
    
};

// this move anywhere, including into walls (and so will dig if entity is also Digger) and into other creatures (and so will attack if also MeleeAttacker)
Game.EntityBehaviors.DangerousWanderBehavior = {
    name: 'DangerousWanderBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {

/*
        if (actor.hasMixin('Seer') && actor.canSee(actor.getMap().getPlayer())) {
            if (actor.hasMixin('MeleeAttacker')) {
                return Game.EntityBehaviors.MeleeHunterBehavior.doBehavior(actor);
            }
        }
*/
        var neighbors = Game.util.coordsNeighboring(actor.getX(),actor.getY());
        var moveTarget = neighbors.random();
        actor.tryMove(moveTarget.x, moveTarget.y, actor.getZ());
        
        return this;
    }
    
};

// attack the player if nearby, otherwise move anywhere, including into walls (and so will dig if entity is also Digger) and into other creatures (and so will attack if also MeleeAttacker)
Game.EntityBehaviors.AggressiveWanderBehavior = {
    name: 'AggressiveWanderBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {

        var attackRes = Game.EntityBehaviors.MeleeAttackerBehavior.doBehavior(actor);
        if (attackRes) {
            return attackRes;
        }
        
        var neighbors = Game.util.coordsNeighboring(actor.getX(),actor.getY());
        var moveTarget = neighbors.random();
        actor.tryMove(moveTarget.x, moveTarget.y, actor.getZ());
        
        return this;
    }
    
};


// this move anywhere, including into walls (and so will dig if entity is also Digger) and into other creatures (and so will attack if also MeleeAttacker)
Game.EntityBehaviors.MeleeAttackerBehavior = {
    name: 'MeleeAttackerBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {
        if (! actor.hasMixin('MeleeAttacker')) {
            return false;
        }

        if (actor.hasMixin('Retaliator')) {
            var retaliationTarget = actor.getRetaliationTarget();
            if (retaliationTarget) {
                if (Game.util.coordsAreAdjacent(retaliationTarget.getX(),retaliationTarget.getY(),actor.getX(),actor.getY())) {
                    actor.attack(retaliationTarget);
                    return this;
                }
                
                if (actor.hasMixin('Seer') && actor.canSee(retaliationTarget)) {
                    return false;
                }
            }
        }
        
        

        // If we are adjacent to another entity, attack it
        var adjCoords = Game.util.coordsNeighboring(actor.getX(),actor.getY());
        for (var i=0; i<adjCoords.length; i++) {
            var adjEntity = actor.getMap().getEntityAt(adjCoords[i].x,adjCoords[i].y,actor.getZ());
            if (adjEntity) {
                if (actor.hasMixin('Allier')) {
                    if (actor.isAlliedWith(adjEntity)) {
                        continue;
                    }
                }
                actor.attack(adjEntity);
                return this;
            }
        }
        
        return false;
    }
    
};


// this move anywhere, including into walls (and so will dig if entity is also Digger) and into other creatures (and so will attack if also MeleeAttacker)
Game.EntityBehaviors.MeleeHunterBehavior = {
    name: 'MeleeHunterBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {
        var player = actor.getMap().getPlayer();
        
        var attackRes = Game.EntityBehaviors.MeleeAttackerBehavior.doBehavior(actor);
        if (attackRes) {
            return attackRes;
        }

        //if (actor.hasMixin('Seer') && actor.canSee(actor.getMap().getPlayer())) {        
            // Generate the path and move to the first tile.
            var source = actor;
            var z = actor.getZ();
            var path = new ROT.Path.AStar(player.getX(), player.getY(), function(x, y) {
                // If an entity is present at the tile, can't move there.
                var entity = source.getMap().getEntityAt(x, y, z);
                if (entity && entity !== player && entity !== source) {
                    return false;
                }
                return source.getMap().getTile(x, y, z).isWalkable();
            }, {topology: 8});

            // Once we've gotten the path, we want to move to the second cell that is
            // passed in the callback (the first is the entity's starting point)
            var count = 0;
            path.compute(source.getX(), source.getY(), function(x, y) {
                if (count == 1) {
                    source.tryMove(x, y, z);
                }
                count++;
            });


            return this;
        //} else {
        //
        //    return false;
        //}
    }
    
};


////////////////////////////////////////////////////////////////
// ACTORS & BEHAVIOR CONTROLLERS

// CSW NOTE: PeacefulRoamingBehaviorController and AggressiveRoamingBehaviorController are VERY similar - consider how they might be combined / refactored (possibly using extendedObj from util)

Game.EntityMixins.PeacefulRoamingBehaviorController = {
    name: 'PeacefulRoamingBehaviorController',
    groupName: 'Actor',
    init: function(template) {
        this._behaviors = template['behaviors'] || [Game.EntityBehaviors.PeacefulWanderBehavior];
        this._baseBehavior = template['baseBehavior'] || Game.EntityBehaviors.PeacefulWanderBehavior;
        this._currentBehavior = Game.EntityBehaviors.PeacefulWanderBehavior;
    },
    act: function() {
        //console.dir(this);
        if (! this._currentBehavior) {
            this._currentBehavior = this._baseBehavior;
        }
        this._currentBehavior = this._currentBehavior.doBehavior(this);
        if (! this._currentBehavior) {
            this.act();
        }

        this.getMap().getScheduler().setDuration(this.getLastActionDuration());
        this.setLastActionDuration(this.getDefaultActionDuration());
        
        this.raiseEvent('onActed');
    }
}

Game.EntityMixins.AggressiveRoamingBehaviorController = {
    name: 'AggressiveRoamingBehaviorController',
    groupName: 'Actor',
    init: function(template) {
        this._behaviors = template['behaviors'] || [Game.EntityBehaviors.DangerousWanderBehavior];
        this._baseBehavior = template['baseBehavior'] || Game.EntityBehaviors.DangerousWanderBehavior;
        this._currentBehavior = this._baseBehavior;
    },
    act: function() {
        //console.dir(this);
        if (! this._currentBehavior) {
            this._currentBehavior = this._baseBehavior;
        }
        if (this.hasMixin('Seer') && this.canSee(this.getMap().getPlayer())) {        
            this._currentBehavior = Game.EntityBehaviors.MeleeHunterBehavior;
        }
        this._currentBehavior = this._currentBehavior.doBehavior(this);
        if (! this._currentBehavior) {
            this.act();
        }

        this.getMap().getScheduler().setDuration(this.getLastActionDuration());
        this.setLastActionDuration(this.getDefaultActionDuration());
        
        this.raiseEvent('onActed');
    }
}

Game.EntityMixins.GiantZombieActor = Game.util.extendedObj(Game.EntityMixins.AggressiveRoamingBehaviorController, {
    init: function(template) {
        Game.EntityMixins.AggressiveRoamingBehaviorController.init.call(this,template);
        
        // We only want to grow the arm once.
        this._hasGrownArm = false;
    },
    growArm: function() {
        this._hasGrownArm = true;
        this.increaseAttackValue(5);
        // Send a message saying the zombie grew an arm.
        Game.sendMessageNearby(this.getMap(),
            this.getX(), this.getY(), this.getZ(),
            'An extra arm appears on the giant zombie!');
    },
    spawnOoze: function() {
        // Generate a random position nearby.
        var xOffset = Math.floor(Math.random() * 3) - 1;
        var yOffset = Math.floor(Math.random() * 3) - 1;

        // Check if we can spawn an entity at that position.
        if (!this.getMap().isEmptyFloor(this.getX() + xOffset, this.getY() + yOffset,
            this.getZ())) {
            // If we cant, do nothing
            return;
        }

        // Create the entity
        var slime = Game.EntityRepository.create('ooze');
        slime.setX(this.getX() + xOffset);
        slime.setY(this.getY() + yOffset)
        slime.setZ(this.getZ());
        this.getMap().addEntity(slime);
    },
    listeners: {
        onDamaged: function(attacker) {
            if ((!this._hasGrownArm) && (this.getHp() <= this.getMaxHp()*.66)) {
                this.growArm();
            }
        },
        onActed: function() {
            if (Math.round(Math.random() * 100) <= 20) {
                this.spawnOoze();
            }
        },
        onDeath: function(attacker) {
            // Switch to win screen when killed!
            Game.switchScreen(Game.Screen.winScreen);
        }
    }
});
    
    
Game.EntityMixins.FruitingFungusActor = {
    name: 'FruitingFungusActor',
    groupName: 'Actor',
    init: function() {
        this._growthsRemaining = 5;
    },
    act: function() {
        //console.log('GrowingFungusActor '+Math.random());
        // Check if we are going to try growing this turn
        if (this._growthsRemaining > 0) {
            if (ROT.RNG.getUniform() <= 0.01) {
                // Generate the coordinates of a random adjacent square by
                // generating an offset between [-1, 0, 1] for both the x and
                // y directions. To do this, we generate a number from 0-2 and then
                // subtract 1.
                var xOffset = Math.floor(ROT.RNG.getUniform() * 3) - 1;
                var yOffset = Math.floor(ROT.RNG.getUniform() * 3) - 1;
                // Make sure we aren't trying to spawn on the same tile as us
                if (xOffset != 0 || yOffset != 0) {
                    // Check if we can actually spawn at that location, and if so
                    // then we grow!
                    if (this.getMap().isEmptyFloor(this.getX() + xOffset,
                                                   this.getY() + yOffset,
                                                   this.getZ())) {
                        var entity;
                        if (ROT.RNG.getUniform() < .25) {
                            entity = Game.EntityRepository.create('fruiting fungus'); //  new Game.Entity(Game.GrowingFungusTemplate);
                        } else {
                            entity = Game.EntityRepository.create('quiescent fungus'); //    new Game.Entity(Game.StaticFungusTemplate);
                        }
                        entity.setPosition(this.getX() + xOffset,this.getY() + yOffset,this.getZ());
                        this.getMap().addEntity(entity);
                        this._growthsRemaining--;
                    }
                }
            }
            this.getMap().getScheduler().setDuration(this.getLastActionDuration());
            this.setLastActionDuration(this.getDefaultActionDuration());
        } else {
            // once this has run out of growths replace it with a quiescent fungus
            this.raiseEvent('onSuicide');
        }
    },
    getGrowthsRemaining: function() {
        return this._growthsRemaining;
    },
    setGrowthsRemaining: function(numGrowths) {
        this._growthsRemaining = numGrowths;
    }
}

Game.EntityMixins.SpreadingFungusActor = {
    name: 'SpreadingFungusActor',
    groupName: 'Actor',
    init: function() {
        this._senescence_countdown = 10;
    },
    act: function() {
        var adjCoords = Game.util.coordsNeighboring(this.getX(),this.getY());
        var map = this.getMap();
        var z = this.getZ();
        
        var spreadCount = 0;

        // NOTE: attacks ALL adjacent enemies on its turn
        for (var i=0; i<adjCoords.length; i++) {
            var x = adjCoords[i].x;
            var y = adjCoords[i].y;
            
            var adjEntity = map.getEntityAt(x,y,z);
            var adjItems = map.getItemsAt(x,y,z);
            
            // first see if there's anything adjacent to attack
            if (adjEntity && ! this.isAlliedWith(adjEntity)) {
                this.attack(adjEntity);
            } else {
                // second, if there's no entity adjacent then see if there are any adjacent corpses to spread to
                if (!adjEntity && adjItems) {
                    for (var j=0;j<adjItems.length;j++) {
                        if ((adjItems[j].getSuperGroup() == 'corpse') && (adjItems[j].getGroup() != 'fungus corpse')){
                            // remove the corpse
                            map.removeItem(adjItems[j],x,y,z);
                            
                            // spawn either a spreading fungus entity or a fungus zombie
                            var entity;
                            if (ROT.RNG.getUniform() < .25) {
                                entity = Game.EntityRepository.create('fungus zombie');
                                spreadCount++;
                            } else {
                                entity = Game.EntityRepository.create('spreading fungus');
                            }
                            entity.setPosition(x,y,z);
                            this.getMap().addEntity(entity);

                            spreadCount++;
                            break;
                        }
                    }
                }
            }
        }

        // then do senescence check
        if (ROT.RNG.getUniform() <= 0.005) {
            this._senescence_countdown--;
        }
        this._senescence_countdown -= spreadCount;
        
        if (this._senescence_countdown < 1) {
            this.raiseEvent('onSuicide');
/*
            var entity = Game.EntityRepository.create('fruiting fungus');
            var oX = this.getX();
            var oY = this.getY();
            var oZ = this.getZ();
            this.getMap().removeEntity(this);
            entity.setPosition(oX,oY,oZ);
            this.getMap().addEntity(entity);
            */
        }

        this.getMap().getScheduler().setDuration(this.getLastActionDuration());
        this.setLastActionDuration(this.getDefaultActionDuration());
    },
    getSenescenceCountdown: function() {
        return this._senescence_countdown;
    },
    setSenescenceCountdown: function(c) {
        this._senescence_countdown = c;
    }
}

////////////////////////////////////////////////////////////////

// Main player's actor mixin
Game.EntityMixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        if (this._acting) {
            return;
        }
        this._acting = true;

        // Detect if the game is over
        if (!this.isAlive()) {
            Game.Screen.playScreen.setGameEnded(true);
            // Send a last message to the player
            Game.sendMessage(this, 'Press [Enter] to continue!');
        }

        // Re-render the screen
        Game.refresh();
        
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        this.getMap().getEngine().lock();
        
        // Clear the message queue
        this.clearMessages();
        this._acting = false;
    },
    finishAction: function() {
        this.raiseEvent('onActed');
        //this.doTurnHunger();
        this.getMap().getScheduler().setDuration(this.getLastActionDuration());
        this.setLastActionDuration(this.getDefaultActionDuration());
        this.getMap().getEngine().unlock();
    }
}

