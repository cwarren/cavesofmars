
Game.Glyph = function(properties) {
    // Instantiate properties to default if they weren't passed
    properties = properties || {};
    this._char = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';
}

// Create standard getters for glyphs
Game.Glyph.prototype.getChar = function(){ 
    return this._char; 
}

Game.Glyph.prototype.getBackground = function(){
    return this._background;
}

Game.Glyph.prototype.getForeground = function(){ 
    return this._foreground; 
}

Game.Glyph.prototype.getColorDesignator = function(){ 
    return '%c{'+this._foreground+'}%b{'+this._background+'}'; 
}

Game.Glyph.prototype.getRepresentation = function() {
    return '%c{' + this._foreground + '}%b{' + this._background + '}' + this._char + '%c{#ccc}%b{black}';
};

Game.Glyph.itemPile = new Game.Glyph({'character':'&','foreground':'black','background':'white'});