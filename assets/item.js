Game.Item = function(properties) {
    properties = properties || {};
    // Call the glyph's construtor with our set of properties
    Game.DynamicGlyph.call(this, properties);
    
    this._invWeight = properties['invWeight'] || 1; // roughly 1g 
    this._invBulk = properties['invBulk'] || 1; // roughly 1 cc
};
// Make items inherit all the functionality from dynamicglyphs (i.e. mixin support et al)
Game.Item.extend(Game.DynamicGlyph);

Game.Item.prototype.setInvWeight = function(v) {
    this._invWeight = v;
}
Game.Item.prototype.getInvWeight = function() {
    return this._invWeight;
}

Game.Item.prototype.setInvBulk = function(v) {
    this._invBulk = v;
}
Game.Item.prototype.getInvBulk = function() {
    return this._invBulk;
}
