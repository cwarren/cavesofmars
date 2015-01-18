Game.Tile = function(properties) {
    properties = properties || {};
    // Call the Glyph constructor with our properties
    Game.Glyph.call(this, properties);
    // Set up the properties. We use false by default.
    this._name = properties['name'] || '';

    this._walkable = properties['walkable'] || false;
    this._airPassable = properties['airPassable'] || this._walkable;
    this._diggable = properties['diggable'] || false;
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

Game.Tile.wallTile = new Game.Tile({
    name: 'wall',
    character: '#',
    foreground: 'goldenrod',
    diggable: true,
    transparent: false,
    description: 'soft sand stone'
    });

Game.Tile.borderTile = new Game.Tile({
    name: 'border',
    character: '#',
    foreground: 'darkRed',
    diggable: false,
    transparent: false,
    description: 'stone to tough to dig'
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
    foreground: '#ec8',
    walkable: true,
    transparent: true,
    description: 'a wind-swept pile of sand'
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


