// CSW NOTE: this seems a bit hack-y in general. Among other things, feels like we should be able to make use of Builder more...?
// CSW NOTE: lots of opportunities to generalize 2D tile manipulation (and possibly 3D as well)
Game.Map.Surface = function() {
    // Call the Map constructor
    Game.Map.call(this, this._generateTiles(250, 96));
    
    this._mapName = 'Elysium Mons Crater';
    
    this.setMapLightingType('fullLight');
    this.addTeammates();

};
Game.Map.Surface.extend(Game.Map);

Game.Map.Surface.prototype.addTeammates = function() {
    
    var centerX = this.getWidth()/2;
    var centerY = this.getHeight()/2;
    
    for (var i=0; i< 7; i++) {
        var tm = new Game.Entity(Game.TeammateTemplate);
        this.addEntityAtRandomPosition(tm,0);
        
        var x = centerX + Game.util.getRandomInteger(-14,14);
        var y = centerY + Game.util.getRandomInteger(-14,14);
        
        if (this.isWalkable(x,y,0)) {
            tm.setPosition(x,y,0);
        }
    }
}

Game.Map.Surface.prototype._fillCircleWithRandom = function(tiles, centerX, centerY, radius, interiorTypesArray, outlineTileTypeOrArray, outlinePercent) {
    // Copied from the DrawFilledCircle algorithm
    // http://stackoverflow.com/questions/1201200/fast-algorithm-for-drawing-filled-circles
    var x = radius;
    var y = 0;
    var xChange = 1 - (radius << 1);
    var yChange = 0;
    var radiusError = 0;

    var usedTileTypes = {};

    while (x >= y) {    
        
        for (var i = centerX - x; i <= centerX + x; i++) {
            var tile = interiorTypesArray.random();
            tiles[i][centerY + y] = tile;
            tiles[i][centerY - y] = tile;
        }
        for (var i = centerX - y; i <= centerX + y; i++) {
            var tile = interiorTypesArray.random();
            tiles[i][centerY + x] = tile;
            tiles[i][centerY - x] = tile;   
        }

        if (outlineTileTypeOrArray instanceof Game.Tile) {
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX - x][centerY + y] = outlineTileTypeOrArray;
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX - x][centerY - y] = outlineTileTypeOrArray;
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX + x][centerY + y] = outlineTileTypeOrArray;
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX + x][centerY - y] = outlineTileTypeOrArray;
            }

            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX - y][centerY + x] = outlineTileTypeOrArray;
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX - y][centerY - x] = outlineTileTypeOrArray;
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX + y][centerY + x] = outlineTileTypeOrArray;
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX + y][centerY - x] = outlineTileTypeOrArray;
            }
        } else {
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX - x][centerY + y] = outlineTileTypeOrArray.random();
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX - x][centerY - y] = outlineTileTypeOrArray.random();
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX + x][centerY + y] = outlineTileTypeOrArray.random();
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX + x][centerY - y] = outlineTileTypeOrArray.random();
            }

            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX - y][centerY + x] = outlineTileTypeOrArray.random();
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX - y][centerY - x] = outlineTileTypeOrArray.random();
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX + y][centerY + x] = outlineTileTypeOrArray.random();
            }
            if (ROT.RNG.getUniform() < outlinePercent) {
                tiles[centerX + y][centerY - x] = outlineTileTypeOrArray.random();
            }
        }
        
        y++;
        radiusError += yChange;
        yChange += 2;
        if (((radiusError << 1) + xChange) > 0) {
            x--;
            radiusError += xChange;
            xChange += 2;
        }
    }
};

Game.Map.Surface.prototype._generateTiles = function(width, height) {
    
    
    // First we create an array, filling it with random walkable surface
    var surfaceTiles = [Game.Tile.sandTile,
                 Game.Tile.heavySandTile,
                 Game.Tile.weatheredStoneTile,
                 Game.Tile.newStoneTile
                ];
                
    var tiles = new Array(width);
    for (var x = 0; x < width; x++) {
        tiles[x] = new Array(height);
        for (var y = 0; y < height; y++) {
            var tile = surfaceTiles.random(); 
        
            if (ROT.RNG.getUniform() < .15) {
                tile = Game.Tile.STANDARD_WALL_TILES.random();
            }
        
            tiles[x][y] = tile;
        }
    }
    
    // Now we determine the radius of the area to carve out.
//    var radius = (Math.min(width, height) - 4) / 2;
    this._fillCircleWithRandom(tiles, width / 2, height / 2, 14, [Game.Tile.sandTile], Game.Tile.STANDARD_WALL_TILES,.6);
    this._fillCircleWithRandom(tiles, width / 2, height / 2, 13, [Game.Tile.sandTile], Game.Tile.STANDARD_WALL_TILES,.7);
    this._fillCircleWithRandom(tiles, width / 2, height / 2, 12, [Game.Tile.sandTile], Game.Tile.basaltTile,.8);
    this._fillCircleWithRandom(tiles, width / 2, height / 2, 11, [Game.Tile.sandTile], Game.Tile.STANDARD_WALL_TILES,.7);

    this._fillCircleWithRandom(tiles, width / 2, height / 2, 10,surfaceTiles,Game.Tile.STANDARD_WALL_TILES,.6);

    // Return the tiles in an array as we only have 1 depth level.
    return [tiles];
};
