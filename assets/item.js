Game.Item = function(properties) {
    properties = properties || {};
    // Call the glyph's construtor with our set of properties
    Game.DynamicGlyph.call(this, properties);

    this._isWeapon = properties['isWeapon'] || false;
    this._isArmor = properties['isArmor'] || false;
    this._isTool = properties['isTool'] || false;
    
    this._attackValue = properties['attackValue'] || 0;
    this._defenseValue = properties['defenseValue'] || 0;
    
    this._invWeight = properties['invWeight'] || 1; // roughly 1g 
    this._invBulk = properties['invBulk'] || 1; // roughly 1 cc
    
    
    
    if (!this._listeners['details']) {
        this._listeners['details'] = [];
    }
    if (!this._listeners['calcDetails']) {
        this._listeners['calcDetails'] = [];
    }
    
    // Add the listeners
    this._listeners['details'].push(function() {
        var results = [];
        
        var uses = this.getUses();
        if (uses) {
            results.push({key: 'use', value: '('+uses.join()+')'});
        }
        if (this.getAttackValue() > 0) {
            results.push({key: 'attack', value: this.getAttackValue()});
        }
        if (this.getDefenseValue() > 0) {
            results.push({key: 'defense', value: this.getDefenseValue()});
        }

        results.push({key: 'mass', value: this.getInvWeight()/1000+' kg'});
        results.push({key: 'bulk', value: this.getInvBulk()/1000+' L'});

        return results;
    });
    this._listeners['calcDetails'].push(function() {
        var results = [];
        if (this.isArmor() && (this === Game.getPlayer().getWearing())) {
            results.push({key: 'use', value: 'armor'});
            if (this.getDefenseValue() > 0) {
                results.push({key: 'defense', value: this.getDefenseValue()});
            }
            if (this.getAttackValue() > 0) {
                results.push({key: 'meleeAttack', value: this.getAttackValue()});
            }
        } else if (this.isWeapon() && (this === Game.getPlayer().getHolding())) {
            results.push({key: 'use', value: 'weapon'});
            if (this.getDefenseValue() > 0) {
                results.push({key: 'defense', value: this.getDefenseValue()});
            }
            if (this.getAttackValue() > 0) {
                results.push({key: 'meleeAttack', value: this.getAttackValue()});
            }
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

Game.Item.prototype.isWeapon = function() {
    return this._isWeapon;
}
Game.Item.prototype.isArmor = function() {
    return this._isArmor;
}
Game.Item.prototype.isTool = function() {
    return this._isTool;
}
Game.Item.prototype.getUses = function() {
    var uses = [];
    if (this.isWeapon()) { uses.push('weapon'); }
    if (this.isArmor()) { uses.push('armor'); }
    if (this.isTool()) { uses.push('tool'); }
    if (this.hasMixin('Ammo')) { uses.push('ammo'); }
    return uses;
}