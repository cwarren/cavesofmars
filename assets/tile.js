Game.Tile = function(properties) {
    properties = properties || {};
    // Call the Glyph constructor with our properties
    Game.Glyph.call(this, properties);
    // Set up the properties. We use false by default.
    this._walkable = properties['walkable'] || false;
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

////////////////////////////////////////////////////////////////

Game.Tile.nullTile = new Game.Tile({
    character: ' ',
    diggable: false,
    transparent: false,
    description: 'you know nothing about this'
});

Game.Tile.floorTile = new Game.Tile({
    character: '.',
    walkable: true,
    transparent: true,
    description: 'A cave floor'
    });

Game.Tile.wallTile = new Game.Tile({
    character: '#',
    foreground: 'goldenrod',
    diggable: true,
    transparent: false,
    description: 'A cave wall'
    });

Game.Tile.borderTile = new Game.Tile({
    character: '#',
    foreground: 'darkRed',
    diggable: false,
    transparent: false,
    description: 'A cave wall made of stone to tough to dig'
    });

Game.Tile.stairsUpTile = new Game.Tile({
    character: '<',
    foreground: 'white',
    walkable: true,
    transparent: true,
    description: 'A rock staircase leading upwards'
    });

Game.Tile.stairsDownTile = new Game.Tile({
    character: '>',
    foreground: 'white',
    walkable: true,
    transparent: true,
    description: 'A rock staircase leading downwards'
    });

Game.Tile.holeToCavernTile = new Game.Tile({
    character: 'O',
    foreground: '#666',
    walkable: true,
    transparent: true,
    description: 'A great, dark hole in the ground - you could probably scramble down'
    });

Game.Tile.waterTile = new Game.Tile({
    character: '~',
    foreground: 'blue',
    walkable: false,
    transparent: true,
    description: 'Forbodingly murky blue water'
    });