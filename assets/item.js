Game.Item = function(properties) {
    properties = properties || {};
    // Call the glyph's construtor with our set of properties
    Game.DynamicGlyph.call(this, properties);
    
    this._attackValue = properties['attackValue'] || 0;
    this._defenseValue = properties['defenseValue'] || 0;
    
    this._invWeight = properties['invWeight'] || 1; // roughly 1g 
    this._invBulk = properties['invBulk'] || 1; // roughly 1 cc
    
    if (!this._listeners['details']) {
        this._listeners['details'] = [];
    }
    
    // Add the listener.
    this._listeners['details'].push(function() {
        var results = [];
        if (this.getAttackValue() > 0) {
            results.push({key: 'attack', value: this.getAttackValue()});
        }
        if (this.hasMixin('Wearable')) {
            if (this === Game.getPlayer().getArmor()) {
                results.push({key: 'defense', value: this.getDefenseValue()});
            }
        } else if (this.getDefenseValue() > 0) {
            results.push({key: 'defense', value: this.getDefenseValue()});
        }

        results.push({key: 'mass', value: this.getInvWeight()/1000+' kg'});
        results.push({key: 'bulk', value: this.getInvBulk()/1000+' L'});

        return results;
    });
                
};
// Make items inherit all the functionality from dynamicglyphs (i.e. mixin support et al)
Game.Item.extend(Game.DynamicGlyph);


Game.Item.prototype.getAttackValue = function() {
    return this._attackValue;
}
Game.Item.prototype.getDefenseValue = function() {
    return this._defenseValue;
}

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
