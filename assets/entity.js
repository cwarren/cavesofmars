Game.Entity = function(properties) {
    properties = properties || {};

    // Instantiate any properties from the passed object
    this._name = properties['name'] || '';
    this._x = properties['x'] || 0;
    this._y = properties['y'] || 0;
    this._z = properties['z'] || 0;
    
    this._map = null;
    this._alive = true;
    
    // Acting speed    
    this._defaultActionDuration = properties['defaultActionDuration'] || 1000;
    this._moveDuration = properties['moveDuration'] || this._defaultActionDuration;
    this._meleeDuration = properties['meleeDuration'] || this._defaultActionDuration;
    this._rangedDuration = properties['rangedDuration'] || this._defaultActionDuration;
    
    this._lastActionDuration = this._defaultActionDuration;    

    // Call the glyph's construtor with our set of properties
    Game.DynamicGlyph.call(this, properties);
}
// Make entities inherit all the functionality from dynamicglyphs (i.e. mixin support et al)
Game.Entity.extend(Game.DynamicGlyph);


Game.Entity.prototype.setX = function(x) {
    this._x = x;
}
Game.Entity.prototype.getX = function() {
    return this._x;
}

Game.Entity.prototype.setY = function(y) {
    this._y = y;
}
Game.Entity.prototype.getY   = function() {
    return this._y;
}

Game.Entity.prototype.setZ = function(z) {
    this._z = z;
}
Game.Entity.prototype.getZ   = function() {
    return this._z;
}

Game.Entity.prototype.setMap = function(map) {
    this._map = map;
}
Game.Entity.prototype.getMap = function() {
    return this._map;
}

Game.Entity.prototype.setDefaultActionDuration = function(newVal) { this._defaultActionDuration = newVal; }
Game.Entity.prototype.getDefaultActionDuration = function() { return this._defaultActionDuration; }

Game.Entity.prototype.setMoveDuration = function(newVal) { this._moveDuration = newVal; }
Game.Entity.prototype.getMoveDuration = function() { return this._moveDuration; }

Game.Entity.prototype.setMeleeDuration = function(newVal) { this._meleeDuration = newVal; }
Game.Entity.prototype.getMeleeDuration = function() { return this._meleeDuration; }

Game.Entity.prototype.setRangedDuration = function(newVal) { this._rangedDuration = newVal; }
Game.Entity.prototype.getRangedDuration = function() { return this._rangedDuration; }


Game.Entity.prototype.setLastActionDuration = function(newVal) { this._lastActionDuration = newVal; }
Game.Entity.prototype.getLastActionDuration = function() { return this._lastActionDuration; }


Game.Entity.prototype.isAlive = function() {
    return this._alive;
};
Game.Entity.prototype.kill = function(killed_by,message) {
    // Only kill once!
    if (!this._alive) {
        return;
    }
    this._alive = false;
    if (message) {
        Game.sendMessage(this, message);
    } else {
        Game.sendMessage(this, "You have died!");
    }

    // Check if the player died, and if so call their act method to prompt the user.
    if (this.hasMixin(Game.EntityMixins.PlayerActor)) {
        this.act();
    } else {
        // CSW NOTE: figure out how to avoid double-messaging the player
        if (killed_by) {
            Game.sendMessageNearby(this.getMap(), this.getX(), this.getY(), this.getZ(),
                            'The %s kills the %s!',
                            [killed_by.getName(), this.getName()]);
        } else {
            Game.sendMessageNearby(this.getMap(), this.getX(), this.getY(), this.getZ(),
                            'The %s dies!',
                            [this.getName()]);
        }
        this.getMap().removeEntity(this);
    }
};

Game.Entity.prototype.switchMap = function(newMap) {

    var oldMap = this.getMap();
    // If it's the same map, nothing to do!
    if (newMap === oldMap) {
        return;
    }
    if (oldMap) {
        this.getMap().removeEntity(this);
    }
    
    // Clear the position
    this._x = 0;
    this._y = 0;
    this._z = 0;

    // Add to the new map
    newMap.addEntityAtRandomPosition(this,0);
    
    // Start the engine!
    newMap.getEngine().start();

};

Game.Entity.prototype.setPosition = function(x, y, z) {
    var oldX = this._x;
    var oldY = this._y;
    var oldZ = this._z;
    this._x = x;
    this._y = y;
    this._z = z;
    // If the entity is on a map, notify the map that the entity has moved.
    if (this._map) {
        this._map.updateEntityPosition(this, oldX, oldY, oldZ);
    }
}

Game.Entity.prototype.alertOnSlowness = function(actionDurationMultiplier) {
    var msgText = ([
        '',
        "You're slightly slower due to the weight you're carrying",
        "The weight you're carrying really slows you down",
        "The weight you're carrying slows you down a lot",
        "The weight you're carrying slows you down a huge amount",
        "You can barely do anything with all the weight you're carrying"
    ]
    )[this.getSlownessStage(actionDurationMultiplier)];
    if (msgText) {
        Game.sendMessage(this, msgText);
    }
/*
    if (actionDurationMultiplier > 4.5) {
        Game.sendMessage(this, "You can barely do anything with all the weight you're carrying");
    }
    else if (actionDurationMultiplier > 3.5) {
        Game.sendMessage(this, "The weight you're carrying slows you down a huge amount");
    }
    else if (actionDurationMultiplier > 2.5) {
        Game.sendMessage(this, "The weight you're carrying slows you down a lot");
    }
    else if (actionDurationMultiplier > 1.5) {
        Game.sendMessage(this, "The weight you're carrying really slows you down");
    }
    else if (actionDurationMultiplier > 1) {
        Game.sendMessage(this, "You're slightly slower due to the weight you're carrying");
    }
    */
}

Game.Entity.prototype.getSlownessColorMod = function(actionDurationMultiplier) {
    var coloring = ([
        '',
        '%c{yellow}',
        '%c{orange}',
        '%c{red}',
        '%c{red}%b{yellow}',
        '%c{yellow}%b{red}'
    ]
    )[this.getSlownessStage(actionDurationMultiplier)];
    
    if (coloring) { return coloring; }
    return '';
}

Game.Entity.prototype.getSlownessStage = function(actionDurationMultiplier) {
    if (actionDurationMultiplier > 4.5) {
        return 5;
    }
    else if (actionDurationMultiplier > 3.5) {
        return 4;
    }
    else if (actionDurationMultiplier > 2.5) {
        return 3;
    }
    else if (actionDurationMultiplier > 1.5) {
        return 2;
    }
    else if (actionDurationMultiplier > 1) {
        return 1;
    }
    return 0;
}

Game.Entity.prototype.tryMove = function(x, y, z, map) {
    var map = this.getMap();

    // Must use starting z
    var tile = map.getTile(x, y, this.getZ());

    var moveDurationMultiplier = 1;
    if (this.hasMixin('InventoryHolder')) {
        moveDurationMultiplier = this.getActionPenaltyFactor();
    }

    // Check if trying to go up or down stairs
    if (z < this.getZ()) {
        if (tile != Game.Tile.stairsUpTile) {
            Game.sendMessage(this, "You can't go up here!");
            return false;
        } else {
            Game.sendMessage(this, "You ascend to level %d!", [z + 1]);
            this.setPosition(x, y, z);
            this.setLastActionDuration(this.getMoveDuration()*moveDurationMultiplier);
            this.alertOnSlowness(moveDurationMultiplier);
            return true;
        }
    } else if (z > this.getZ()) {
        if (tile === Game.Tile.holeToCavernTile &&
            this.hasMixin(Game.EntityMixins.PlayerActor)) {
            // Switch the entity to a boss cavern!
            this.switchMap(new Game.Map.BossCavern());
            this.setLastActionDuration(this.getMoveDuration()*moveDurationMultiplier);
            this.alertOnSlowness(moveDurationMultiplier);
            return true;
        } else if (tile != Game.Tile.stairsDownTile) {
            Game.sendMessage(this, "You can't go down here!");
            return false;
        } else {
            this.setPosition(x, y, z);
            Game.sendMessage(this, "You descend to level %d!", [z + 1]);
            this.setLastActionDuration(this.getMoveDuration()*moveDurationMultiplier);
            this.alertOnSlowness(moveDurationMultiplier);
            return true;
        }
    }

    // can't walk through other entities
    // Check if trying to attack something that can be attacked
    // and if so attack it
    var target = map.getEntityAt(x, y, this.getZ());
    if (target && target != this) {
        if (this.hasMixin('MeleeAttacker') && target.hasMixin('Destructible')) {
            if (this.hasMixin('Allier')) {
                if (this.isAlliedWith(target)) {
                    return false;
                }
            }
            this.attack(target);
            return true;
        }
        return false;
    }


    // Check if we can walk on the tile
    // and if so simply walk onto it
    if (tile.isWalkable()) {        
        // Update the entity's position
        this.setPosition(x, y, z);
        
        // Notify the entity that there are items at this position
        var items = this.getMap().getItemsAt(x, y, z);
        if (items) {
            if (items.length === 1) {
                Game.sendMessage(this, "You see %s.", [items[0].describeA()]);
            } else {
                Game.sendMessage(this, "There are several objects here.");
            }
        }

        this.setLastActionDuration(this.getMoveDuration()*moveDurationMultiplier);
        this.alertOnSlowness(moveDurationMultiplier);
        return true;
    }

    // Check if the tile is diggable, and
    // if so try to dig it
    if (tile.isDiggable() && this.hasMixin('Digger')) {
        this.digAt(x, y, z);
        return true;
    } else {
        Game.sendMessage(this,'the %s seems not to be diggable',[tile.getName()]);
        Game.refresh();
    }
    return false;
}