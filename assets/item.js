Game.Item = function(properties) {
    properties = properties || {};
    // Call the glyph's construtor with our set of properties
    Game.DynamicGlyph.call(this, properties);
};
// Make items inherit all the functionality from dynamicglyphs (i.e. mixin support et al)
Game.Item.extend(Game.DynamicGlyph);


