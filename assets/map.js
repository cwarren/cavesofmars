Game.Map = function(tiles) {
    this._tiles = tiles;

    // Cache dimensions
    this._depth = tiles.length
    this._width = tiles[0].length;
    this._height = tiles[0][0].length;

    // Setup the field of visions
    this._fov = [];
    this.setupFov();

    // Create a table which will hold the entities
    this._entities = {};

    // Create a table which will hold the items
    this._items = {};

    // Create the engine and scheduler
    //this._scheduler = new ROT.Scheduler.Speed();
    this._scheduler = new ROT.Scheduler.Action();
    this._engine = new ROT.Engine(this._scheduler);

    // Setup the explored array
    this._explored = new Array(this._depth);
    this._setupExploredArray();
};

// Standard getters
Game.Map.prototype.getDepth = function() {
    return this._depth;
};

Game.Map.prototype.getWidth = function() {
    return this._width;
};

Game.Map.prototype.getHeight = function() {
    return this._height;
};

Game.Map.prototype.getEngine = function() {
    return this._engine;
}

Game.Map.prototype.getPlayer = function() {
    return this._player;
};

Game.Map.prototype.getEntities = function() {
    return this._entities;
}

Game.Map.prototype.getFov = function(depth) {
    return this._fov[depth];
}

Game.Map.prototype.getAllFovs = function() {
    return this._fov;
}

Game.Map.prototype.getScheduler = function() {
    return this._scheduler;
}


Game.Map.prototype.setupFov = function() {
    // Keep this in 'map' variable so that we don't lose it.
    var map = this;
    // Iterate through each depth level, setting up the field of vision
    for (var z = 0; z < this._depth; z++) {
        // We have to put the following code in it's own scope to prevent the
        // depth variable from being hoisted out of the loop.
        (function() {
            // For each depth, we need to create a callback which figures out
            // if light can pass through a given tile.
            var depth = z;
            map._fov.push(
                new ROT.FOV.DiscreteShadowcasting(function(x, y) {
                    return !map.getTile(x, y, depth).isOpaque();
                }, {topology: 8}));
        })();
    }
}

Game.Map.prototype._setupExploredArray = function() {
    for (var z = 0; z < this._depth; z++) {
        this._explored[z] = Game.util.newArray2D(this._width,this._height,false);
    }
};

Game.Map.prototype.setExplored = function(x, y, z, state) {
    // Only update if the tile is within bounds
    if (this.getTile(x, y, z) !== Game.Tile.nullTile) {
        this._explored[z][x][y] = state;
    }
};

Game.Map.prototype.isExplored = function(x, y, z) {
    // Only return the value if within bounds
    if (this.getTile(x, y, z) !== Game.Tile.nullTile) {
        return this._explored[z][x][y];
    } else {
        return false;
    }
};

// Gets the tile for a given coordinate set
Game.Map.prototype.getTile = function(x, y, z) {
    // Make sure we are inside the bounds. If we aren't, return
    // null tile.
    //console.log('getting tile '+x+','+y+','+z);
    if (x < 0 || x >= this._width || y < 0 || y >= this._height || z < 0 || z >= this._depth) {
        return Game.Tile.nullTile;
    } else {
        //console.dir(this);
        return this._tiles[z][x][y] || Game.Tile.nullTile;
    }
};

Game.Map.prototype.dig = function(x, y, z) {
    // If the tile is diggable, update it to a floor
    if (this.getTile(x, y, z).isDiggable()) {
        this._tiles[z][x][y] = Game.Tile.floorTile;
    }
}

Game.Map.prototype.isEmptyFloor = function(x, y, z) {
    // Check if the tile is floor and also has no entity
    return this.getTile(x, y, z) == Game.Tile.floorTile &&
           !this.getEntityAt(x, y, z);
}

Game.Map.prototype.getEntityAt = function(x, y, z){
    return this._entities[x + ',' + y + ',' + z];
}

Game.Map.prototype.getEntitiesWithinRadius = function(centerX, centerY, centerZ, radius) {
    results = [];
    // Determine our bounds
    var leftX = centerX - radius;
    var rightX = centerX + radius;
    var topY = centerY - radius;
    var bottomY = centerY + radius;
    // Iterate through our entities, adding any which are within the bounds CSW NOTE: consider better ways to do this
    for (var key in this._entities) {
        var entity = this._entities[key];
        if (entity.getX() >= leftX && entity.getX() <= rightX && 
            entity.getY() >= topY && entity.getY() <= bottomY &&
            entity.getZ() == centerZ) {
            results.push(entity);
        }
    }
    return results;
}

Game.Map.prototype.updateEntityPosition = function(entity, oldX, oldY, oldZ) {
    // Delete the old key if it is the same entity
    // and we have old positions.
    if (typeof oldX === 'number') {
        var oldKey = oldX + ',' + oldY + ',' + oldZ;
        if (this._entities[oldKey] == entity) {
            delete this._entities[oldKey];
        }
    }
    // Make sure the entity's position is within bounds
    if (entity.getX() < 0 || entity.getX() >= this._width ||
        entity.getY() < 0 || entity.getY() >= this._height ||
        entity.getZ() < 0 || entity.getZ() >= this._depth) {
        console.dir(entity);
        throw new Error("Entity's position is out of bounds.");
    }
    // Sanity check to make sure there is no entity at the new position.
    var key = entity.getX() + ',' + entity.getY() + ',' + entity.getZ();
    if (this._entities[key]) {
        throw new Error('Tried to add an entity at an occupied position.');
    }
    // Add the entity to the table of entities
    this._entities[key] = entity;
};


Game.Map.prototype.addEntity = function(entity) {
    // Update the entity's map
    entity.setMap(this);

/*
    // make sure the entity is placed in a legal position
    if (! this.isEmptyFloor(entity.getX(),entity.getY(),entity.getZ())) {
        this.addEntityAtRandomPosition(entity,entity.getZ());
    }
*/

    // Update the map with the entity's position
    this.updateEntityPosition(entity);

    // Check if this entity is an actor, and if so add it to the scheduler
    if (entity.hasMixin('Actor')) {
       this._scheduler.add(entity, true, entity.getDefaultActionDuration());
    }

    // If the entity is the player, set the player.
    if (entity.hasMixin(Game.EntityMixins.PlayerActor)) {
        this._player = entity;
    }
};

Game.Map.prototype.nuke = function(dynamicGlyph) {
    delete Game.ALL_THINGS[dynamicGlyph.getKey()];

    // If the entity is an actor, remove them from the scheduler
    if (dynamicGlyph.hasMixin('Actor')) {
        this._scheduler.remove(dynamicGlyph);
    }

    // If the entity is the player, set the player.
    if (dynamicGlyph.hasMixin(Game.EntityMixins.PlayerActor)) {
        this._player = undefined;
    }
}

Game.Map.prototype.removeEntity = function(entity) {

    // Remove the entity from the map
    var key = entity.getX() + ',' + entity.getY() + ',' + entity.getZ();
    if (this._entities[key] == entity) {
        delete this._entities[key];
    }
    
    this.nuke(entity);
/*
    delete Game.ALL_THINGS(entity.getId());

    // If the entity is an actor, remove them from the scheduler
    if (entity.hasMixin('Actor')) {
        this._scheduler.remove(entity);
    }

    // If the entity is the player, set the player.
    if (entity.hasMixin(Game.EntityMixins.PlayerActor)) {
        this._player = undefined;
    }
*/
};


Game.Map.prototype.removeItem = function(itm,x,y,z) {
    var mapItems = this.getItemsAt(x,y,z);

    // Iterate through all items there until a match is found
    for (var i = 0; i < mapItems.length; i++) {
        if (mapItems[i].getId() == itm.getId()) {
            mapItems.splice(i, 1);
            break;
        }
    }
    // Update the map items
    this.setItemsAt(x,y,z, mapItems);
    this.nuke(itm);
}


Game.Map.prototype.getRandomFloorPosition = function(z) {
    // Randomly generate a tile which is a floor
    var x, y;
    do {
        x = Math.floor(ROT.RNG.getUniform() * this._width);
        y = Math.floor(ROT.RNG.getUniform() * this._height);
    } while(!this.isEmptyFloor(x, y, z));
    return {x: x, y: y, z: z};
}

Game.Map.prototype.addEntityAtRandomPosition = function(entity, z) {
    var position = this.getRandomFloorPosition(z);
    entity.setPosition(position.x,position.y,z);
    this.addEntity(entity);
//    console.dir(entity);
}

Game.Map.prototype.getItemsAt = function(x, y, z) {
    return this._items[x + ',' + y + ',' + z];
};

Game.Map.prototype.setItemsAt = function(x, y, z, items) {
    // If our items array is empty, then delete the key from the table.
    var key = x + ',' + y + ',' + z;
    if (items.length === 0) {
        if (this._items[key]) {
            delete this._items[key];
        }
    } else {
        // Simply update the items at that key
        this._items[key] = items;
    }
};

Game.Map.prototype.addItem = function(x, y, z, item) {
    // If we already have items at that position, simply append the item to the 
    // list of items.
    var key = x + ',' + y + ',' + z;
    if (this._items[key]) {
        this._items[key].push(item);
    } else {
        this._items[key] = [item];
    }
};

Game.Map.prototype.addItemAtRandomPosition = function(item, z) {
    var position = this.getRandomFloorPosition(z);
    this.addItem(position.x, position.y, position.z, item);
};

