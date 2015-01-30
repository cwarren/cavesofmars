Game.Tile = function(properties) {
    properties = properties || {};
    // Call the Glyph constructor with our properties
    Game.Glyph.call(this, properties);
    // Set up the properties. We use false by default.
    this._name = properties['name'] || '';

    this._walkable = properties['walkable'] || false;
    this._airPassable = properties['airPassable'] || this._walkable;
    this._diggable = properties['diggable'] || false;
    this._digResistance = properties['digResistance'] || 10;
    this._digDropChance = properties['digDropChance'] || .1;
    this._digDropTable = properties['digDropTable'] || ['rock'];
    
    this._transparent = properties['transparent'] || false;
    this._opaque = (properties['opaque'] !== undefined) ?
        properties['opaque'] : (! this._transparent);
    this._transparent = ! this._opaque;
    this._description = properties['description'] || '';
};
// Make tiles inherit all the functionality from glyphs
Game.Tile.extend(Game.Glyph);

// Standard getters
Game.Tile.prototype.isWalkable = function() {
    return this._walkable;
}
Game.Tile.prototype.isAirPassable = function() {
    return this._airPassable;
}
Game.Tile.prototype.isDiggable = function() {
    return this._diggable;
}
Game.Tile.prototype.getDigResistance = function() {
    return this._digResistance;
}

Game.Tile.prototype.getDigDropChance = function() {
    return this._digDropChance;
}
Game.Tile.prototype.getDigDrop = function() {
    if (this._digDropTable && (ROT.RNG.getUniform() < this.getDigDropChance()) ) {
        return Game.ItemRepository.create(this._digDropTable.random());
    }
    return null;
}


Game.Tile.prototype.isTransparent = function() {
    return this._transparent;
}
Game.Tile.prototype.isOpaque = function() {
    return this._opaque;
}
Game.Tile.prototype.getDescription = function() {
    return this._description;
};
Game.Tile.prototype.getName = function() {
    return this._name;
};

// Standard setters
Game.Tile.prototype.setWalkable = function(state) {
    this._walkable = state;
}
Game.Tile.prototype.setDiggable = function(state) {
    this._diggable = state;
}
Game.Tile.prototype.setDigResistance = function(dr) {
    this._digResistance = dr;
}
Game.Tile.prototype.setTransparent = function(state) {
    this._transparent = state;
    this._opaque = ! state;
}
Game.Tile.prototype.setOpaque = function(state) {
    this._opaque = state;
    this._transparent = ! state;
}
Game.Tile.prototype.setDescription = function(descr) {
    this._description = descr;
}
Game.Tile.prototype.setName = function(name) {
    this._name = name;
};


////////////////////////////////////////////////////////////////

Game.Tile.nullTile = new Game.Tile({
    name: 'null',
    character: ' ',
    diggable: false,
    transparent: false,
    description: 'you know nothing about this'
});

Game.Tile.airTile = new Game.Tile({
    name: 'air',
    character: ' ',
    diggable: false,
    walkable: true,
    transparent: true,
    description: 'open air'
    });


Game.Tile.floorTile = new Game.Tile({
    name: 'floor',
    character: '.',
    walkable: true,
    transparent: true,
    description: 'cave floor'
    });

Game.Tile.hardSandstoneTile = new Game.Tile({
    name: 'hard sandstone',
    character: '#',
    foreground: '#ca4',
    diggable: true,
    digResistance: 11,
    digDropChance: .3,
    digDropTable: ['rock','rock','rock','rock','rock','rock','stone shot'],
    transparent: false,
    description: 'hard sandstone'
    });

Game.Tile.softenedSandstoneTile = new Game.Tile({
    name: 'softened sandstone',
    character: '#',
    foreground: '#b85',
    diggable: true,
    digResistance: 8,
    digDropChance: .2,
    digDropTable: ['rock','rock','rock','rock','rock','rock','rock','rock','stone shot','stone shot','iron shot'],
    transparent: false,
    description: 'softened sandstone'
    });

Game.Tile.basaltTile = new Game.Tile({
    name: 'weak basalt',
    character: '#',
    foreground: '#557',
    diggable: true,
    digResistance: 16,
    digDropChance: .2,
    digDropTable: ['rock','stone shot'],
    transparent: false,
    description: 'weak basalt'
    });

Game.Tile.slightlyCrackedStoneTile = new Game.Tile({
    name: 'slightly cracked stone',
    character: '#',
    foreground: '#987',
    diggable: true,
    digResistance: 10,
    digDropChance: .4,
    transparent: false,
    description: 'slightly cracked stone'
    });

Game.Tile.crackedStoneTile = new Game.Tile({
    name: 'cracked stone',
    character: '#',
    foreground: '#ca7',
    diggable: true,
    digResistance: 5,
    digDropChance: .6,
    digDropTable: ['rock','rock','rock','rock','rock','rock','stone shot'],
    transparent: false,
    description: 'cracked stone'
    });

Game.Tile.rubbleTile = new Game.Tile({
    name: 'rubble',
    character: '#',
    foreground: '#eca',
    diggable: true,
    digResistance: 3,
    digDropChance: .8,
    digDropTable: ['rock','rock','rock','rock','rock','rock','stone shot'],
    transparent: false,
    description: 'rubble'
    });

Game.Tile.STANDARD_WALL_TILES = [
Game.Tile.hardSandstoneTile,
Game.Tile.softenedSandstoneTile,
Game.Tile.basaltTile,
Game.Tile.slightlyCrackedStoneTile,
Game.Tile.crackedStoneTile,
Game.Tile.rubbleTile
],

Game.Tile.borderTile = new Game.Tile({
    name: 'strong basalt',
    character: '#',
    foreground: '#446',
    diggable: false,
    transparent: false,
    description: 'strong basalt - stone too tough to dig'
    });

Game.Tile.stairsUpTile = new Game.Tile({
    name: 'stairs up',
    character: '<',
    foreground: 'white',
    walkable: true,
    transparent: true,
    description: 'A way up'
    });

Game.Tile.stairsDownTile = new Game.Tile({
    name: 'stairs down',
    character: '>',
    foreground: 'white',
    walkable: true,
    transparent: true,
    description: 'A way down'
    });

Game.Tile.holeToCavernTile = new Game.Tile({
    name: 'dark hole',
    character: 'O',
    foreground: '#666',
    walkable: true,
    transparent: true,
    description: 'A great, dark hole in the ground - you could probably scramble down'
    });

Game.Tile.waterTile = new Game.Tile({
    name: 'deep water',
    character: '~',
    foreground: 'blue',
    walkable: false,
    transparent: true,
    description: 'forbodingly murky blue water'
    });


Game.Tile.sandTile = new Game.Tile({
    name: 'sand',
    character: '~',
    foreground: '#db7',
    walkable: true,
    transparent: true,
    description: 'a pile of sand'
});

Game.Tile.heavySandTile = new Game.Tile({
    name: 'heavy sand',
    character: '~',
    foreground: '#fda',
    walkable: true,
    transparent: true,
    description: 'heavier sand filling a slight depression'
});

Game.Tile.weatheredStoneTile = new Game.Tile({
    name: 'weathered stone',
    character: '.',
    foreground: '#f92',
    walkable: true,
    transparent: true,
    description: 'stone surface, well worn by the passage of time'
});

Game.Tile.newStoneTile = new Game.Tile({
    name: 'new stone',
    character: '.',
    foreground: '#da9',
    walkable: true,
    transparent: true,
    description: 'stone surface, freshly exposed to the elements'
    });


