Game.Map.Cave = function() {

    // Create a map based on our size parameters
    var width = 128;
    var height = 48;
    var depth = 6;
    
    var tiles = new Game.Builder(width, height, depth).getTiles();
//                    var map = new Game.Map.Cave(tiles, this._player);

    
    // Call the Map constructor
    Game.Map.call(this, tiles);
    //this.setMapLightingType('fullLight');
    
    this._mapName = 'The Caves';

    // Add the player
//    this.addEntityAtRandomPosition(player, 0);


    for (var z = 0; z < this._depth; z++) {
        // 15 entities per floor
        for (var i = Game.util.getRandomInteger(-3,3); i < 15; i++) {
            var entity = Game.RandomEntitiesByLevel[z].getOne();
            this.addEntityAtRandomPosition(entity, z);

            // Level up the entity based on the floor
            if (entity.hasMixin('ExperienceGainer')) {
                for (var level = Game.util.getRandomInteger(-1,1); level < z; level++) {
                    entity.giveExperience(entity.getNextLevelExperience() -
                        entity.getExperience());
                }
            }
        }

        // 15 random items per floor
        for (var i = Game.util.getRandomInteger(-3,3); i < 15; i++) {
            // Add a random entity
            this.addItemAtRandomPosition(Game.RandomInitialItemsByLevel[z].getOne(),z);
        }
    }    

/*
    // Add random entities and items to each floor.
    for (var z = 0; z < this._depth; z++) {
        // 15 entities per floor
        for (var i = 0; i < 15; i++) {
            var entity = Game.EntityRepository.createRandom();
            // Add a random entity
            this.addEntityAtRandomPosition(entity, z);
            // Level up the entity based on the floor
            if (entity.hasMixin('ExperienceGainer')) {
                for (var level = 0; level < z; level++) {
                    entity.giveExperience(entity.getNextLevelExperience() -
                        entity.getExperience());
                }
            }

            this.addEntityAtRandomPosition(Game.EntityRepository.create('quiescent fungus'), z);
        }
        // 15 random items per floor
        for (var i = 0; i < 15; i++) {
            // Add a random entity
            this.addItemAtRandomPosition(Game.ItemRepository.createRandom(), z);
        }
    }

    // Add weapons and armor to the map in random positions and floors
    
    var templatesShallow =[
                    'HEM suit, damaged',
                    'HEM suit, damaged',
                    'HEM suit, damaged',
                    'JAT tool, damaged',
                    'JAT tool, damaged',
                    'JAT tool, damaged',
                    'leather armor',
                    'shard blade',
                    'staff',
                    'human corpse',
                    'human corpse',
                    'human corpse',
                    'human corpse'
                    ];
    var templatesMedium =[
                    'HEM suit',
                    'HEM suit, damaged',
                    'HEM suit, damaged',
                    'JAT tool, damaged',
                    'JAT tool, damaged',
                    'leather armor',
                    'leather armor',
                    'plated leather armor',
                    'shard blade',
                    'shard blade',
                    'shod staff',
                    'staff',
                    'stone sword',
                    'human corpse',
                    'human corpse',
                    'human corpse',
                    ];
    var templatesDeep =[
                    'HEM suit',
                    'HEM suit, damaged',
                    'HEM-A suit',
                    'JAT tool',
                    'JAT tool, damaged',
                    'JAT tool, damaged',
                    'leather armor',
                    'plated leather armor',
                    'shard blade',
                    'shod staff',
                    'staff',
                    'stone sword',
                    'human corpse'
                    ];
    
    var depthDivision = this._depth/3;
    
    // scatter one of each shallow item over the first floor set
    for (var i = 0; i < templatesShallow.length; i++) {
        this.addItemAtRandomPosition(Game.ItemRepository.create(templatesShallow[i]),
            Math.floor(depthDivision * Math.random()));
    }
    
    // add additional items, graded a bit by depth
    for (var d = 0; d < this._depth; d++) {
        var templates = templatesDeep;
        if (d < depthDivision) {
            templates = templatesShallow;
        } else
        if (d < depthDivision*2) {
            templates = templatesMedium;
        }
        
        for (var itemCount = 2 + Math.floor(ROT.RNG.getUniform()*4); itemCount > 0; itemCount--) {
            this.addItemAtRandomPosition(Game.ItemRepository.create(templates.random()),d);
        }
        
        if (ROT.RNG.getUniform() < .1) {
            this.addItemAtRandomPosition(Game.ItemRepository.create(templatesMedium.random()),d);
        }
        if (ROT.RNG.getUniform() < .1) {
            this.addItemAtRandomPosition(Game.ItemRepository.create(templatesDeep.random()),d);
        }
    }
    
*/

/*

    for (var i = 0; i < templates.length; i++) {
        this.addItemAtRandomPosition(Game.ItemRepository.create(templates[i]),
            Math.floor(this._depth * Math.random()));
    }

    for (var i = 0; i < templates.length; i++) {
        this.addItemAtRandomPosition(Game.ItemRepository.create(templates[i]),
            Math.floor(this._depth * Math.random()));
    }
*/    
    
    // Add a hole to the final cavern on the last level.
    var holePosition = this.getRandomFloorPosition(this._depth - 1);
    this._tiles[this._depth - 1][holePosition.x][holePosition.y] = 
        Game.Tile.holeToCavernTile;
};

Game.Map.Cave.extend(Game.Map);