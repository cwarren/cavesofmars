Game.Screen = {};

// CSW NOTE: consider adding a screen stack here (Game.Screen.ScreensStack = Array) - this would be used by the switch screen function to handle deeper structures than a simple current-screen-and-new-screen arrangement

Game.Screen.DEFAULT_COLOR_SETTER = '%c{white}%b{black}';

// Define our initial start screen
Game.Screen.startScreen = {
    enter: function() { Game.AuxScreen.helpScreen.refresh(['none']); },
    exit: function() { Game.AuxScreen.helpScreen.refresh(); },
    render: function(display) {
        // Render our prompt to the screen
display.drawText(2,1,  "............................................................................");
display.drawText(2,2,  "................................_..._.......................................");
display.drawText(2,3,  "...............................|.|.|.|......................................");
display.drawText(2,4,  ".............................._|.|_|.|__...___..............................");
display.drawText(2,5,  ".............................|_..__|.'_.\\./._.\\.............................");
display.drawText(2,6,  "...............................|.|_|.|.|.|..__/.............................");
display.drawText(2,7,  "................................\\__|_|.|_|\\___|.............................");
display.drawText(2,8,  "............................................................................");
display.drawText(2,9,  ".._____...___.._..._._____._____..........__..___..___..___..______.._____..");
display.drawText(2,10, "./..__.\\./._.\\|.|.|.|..___/..___|......../._|.|..\\/..|./._.\\.|.___.\\/..___|.");
display.drawText(2,11, ".|./..\\//./_\\.\\.|.|.|.|__.\\.`--.....___.|.|_..|......|/./_\\.\\|.|_/./\\.`--...");
display.drawText(2,12, ".|.|....|.._..|.|.|.|..__|.`--..\\../._.\\|.._|.|.|\\/|.||.._..||..../..`--..\\.");
display.drawText(2,13, ".|.\\__/\\|.|.|.\\.\\_/./.|___/\\__/./.|.(_).|.|...|.|..|.||.|.|.||.|\\.\\./\\__/./.");
display.drawText(2,14, "..\\____/\\_|.|_/\\___/\\____/\\____/...\\___/|_|...\\_|..|_/\\_|.|_/\\_|.\\_|\\____/..");
display.drawText(2,15, "............................................................................");

        display.drawText(28,20, "%c{yellow}Press [Enter] to start");

        
    },
    handleInput: function(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                setTimeout(function(){
                    Game.Screen.playScreen.setSubScreen(Game.Screen.storyScreen);
                    Game.switchScreen(Game.Screen.playScreen);
                },40);
                
                //Game.Screen.playScreen.setSubScreen(Game.Screen.helpScreenNumpad);
            }
        }
    }
}

// Define our playing screen
Game.Screen.playScreen = {
    //_map : null,
    _player: null,
    _gameEnded: false,
    _subScreen: null,
    _parentScreen: null,
    _moveCounter: 0,
    _helpSections: ['movement','levels','worldinteraction','inventory','sense','meta'],
    getHelpSections: function() {
        if (this._subScreen) {
            return this._subScreen.getHelpSections();
        }
        return this._helpSections;
    },
    setSubScreen: function(subScreen) {
            
            this._subScreen = subScreen;
            if (subScreen) {
                subScreen.setParentScreen(this);
            }
            Game.AuxScreen.helpScreen.refresh(this.getHelpSections());
            
            Game.refresh();
    },
    getPlayer: function() {
        return this._player;
    },
    enter: function() {
        console.log('entered play screen');        

//        width = 80;
//        height = 24;
//        depth = 1;

        this._player = Game.getPlayer();
        
        this._moveCounter = 0;
        
        Game.AuxScreen.helpScreen.refresh();
        
        // Create our map from the tiles and player
//        var tiles = new Game.Builder(width, height, depth).getTiles();
//        var map = new Game.Map.Cave(tiles, this._player);
        
        // Start the map's engine
//        map.getEngine().start();
    },
    exit: function() { console.log("Exited play screen."); },
    getScreenOffsets: function() {
        // Make sure we still have enough space to fit an entire game screen
        var topLeftX = Math.max(0, this._player.getX() - (Game.getScreenWidth() / 2));
        
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._player.getMap().getWidth() - Game.getScreenWidth());
        
        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (Game.getScreenHeight() / 2));
        
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._player.getMap().getHeight() - Game.getScreenHeight());
        
        return {
            x: topLeftX,
            y: topLeftY
        };
    },
    renderTiles: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        
        var offsets = this.getScreenOffsets();
        
        var topLeftX = offsets.x;
        var topLeftY = offsets.y;
        
        // This object will keep track of all visible map cells
        var visibleCells = {};
        
        // Store this._player.getMap() and player's z to prevent losing it in callbacks
        var map = this._player.getMap();
        var z = this._player.getZ();
        var fullyLightMap = (map.getMapLightingType() == 'fullLight');
        
        // Find all visible cells and update the object
        map.getFov(z).compute(
            this._player.getX(), this._player.getY(), 
            this._player.getSightRadius(), 
            function(x, y, radius, visibility) {
                visibleCells[x + "," + y] = true;
                // Mark cell as explored
                map.setExplored(x, y, z, true);
            });
        // Render the explored map cells
        // CSW NOTE: figure out how to prevent remembered map wall changes from showing up immediately - probably need a full shadow (or perhaps 'visited') copy of the map which is shown and updated as cell become visible
        
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (map.isExplored(x, y, z) || fullyLightMap) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position.
                    var glyph = map.getTile(x, y, z);
                    var foreground = glyph.getForeground();
                    // If we are at a cell that is in the field of vision, we need
                    // to check if there are items or entities.
                    if (fullyLightMap || visibleCells[x + ',' + y]) {
                        // Check for items first, since we want to draw entities
                        // over items.
                        var items = map.getItemsAt(x, y, z);
                        // If we have items, render a single item if there's only one, or a pile glyph otherwise
                        if (items) {
                            if (items.length == 1) {
                                glyph = items[items.length - 1];
                            } else {
                                glyph = Game.Glyph.itemPile;
                            }
                        }
                        // Check if we have an entity at the position 
                        if (map.getEntityAt(x, y, z)) {
                            glyph = map.getEntityAt(x, y, z);

                            // if the entity is mobile, dangerous, and not allied then interrupt any ongoing action
                            if (glyph!=this._player && this._player._ogaActivity) {
                                var dist = Math.max( Math.abs(glyph.getX()-this._player.getX()) , Math.abs(glyph.getY()-this._player.getY()) );
                                // CSW NOTE: this is where a player-set interrupt control could come in - the player could choose the radius of interruption, but for now it's fixed at 3
                                if (dist <= 3) {
//                                    console.log('interrupt possible due to mob prox of '+dist);
//                                    console.dir(glyph);
//                                    Game.ALL_THINGS[glyph.getId()] = glyph;
                                    if (glyph.hasMixin('Attacker') && 
                                        (glyph.hasMixin('AggressiveWanderBehavior') || glyph.hasMixin('DangerousWanderBehavior') || glyph.hasMixin('MeleeHunterBehavior') || glyph.hasMixin('MeleeHunterBehavior'))
                                       )
                                    {
                                        if (glyph.hasMixin('Allier')) {
                                            if (! glyph.isAlliedWith(this._player)) {
                                                this._player.setOgaInterrupt(true);
                                            }
                                        } else {
                                            this._player.setOgaInterrupt(true);
                                        }
                                    }
                                }
                            }
                            
                        }
                        // Update the foreground color in case our glyph changed
                        foreground = glyph.getForeground();
                    } else if (! fullyLightMap) {
                        // Since the tile was previously explored but is not 
                        // visible, we want to change the foreground color to
                        // dark gray.
                        foreground = '#666';
                    }
                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        glyph.getChar(), 
                        foreground, 
                        glyph.getBackground());
                }
            }
        }
    },
    renderPlayerMessages: function(display) {
        Game.AuxScreen.messageScreen.render();
    },
    renderPlayerStats: function(display) {
        Game.AuxScreen.avatarScreen.render();
    },
    render: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

        // Render subscreen if there is one
        if (this._subScreen) {
            this._subScreen.render(display);
            return;
        }
        
        this.renderTiles(display);
        
        //this.renderPlayerMessages(display);
        //this.renderPlayerStats(display);

        
    },
    handleInput: function(inputType, inputData) {
        if (this._player._ogaActivity) {
            if ((inputData.keyCode === ROT.VK_ESCAPE) || (inputData.keyCode === ROT.VK_SPACE)) {
                this._player.setOgaInterrupt(true);
            }
            return;
        }
        
        // If the game is over, enter will bring the user to the losing screen.
        if (this._gameEnded) {
            if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
            // Return to make sure the user can't still play
            return;
        }

        // Handle subscreen input if there is one
        if (this._subScreen) {
            this._subScreen.handleInput(inputType, inputData);
            return;
        }

        if ((inputData.keyCode === ROT.VK_ESCAPE) || (inputData.keyCode === ROT.VK_SPACE)) {
            Game.refresh();
            return;
        }

        var tookAction = false;        
        var gameAction = Game.Bindings.getAction(inputType, inputData, Game.getControlScheme());
        if (gameAction == undefined) {
            return;
        }

        //----------------------------
        // inventory actions
        if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_LIST) {
//            this._player._CleanInventory();
            this.showItemsSubScreen(Game.Screen.inventoryScreen, this._player.getItems(),'You are not carrying anything.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_DROP) {
            this.showItemsSubScreen(Game.Screen.dropScreen, this._player.getItems(),'You have nothing to drop.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_EAT) {
            this.showItemsSubScreen(Game.Screen.eatScreen, this._player.getItems(),'You have nothing to eat.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_HOLD) {
            this.showItemsSubScreen(Game.Screen.holdScreen, this._player.getItems(),'You have nothing to put in your hands.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_WEAR) {
            this.showItemsSubScreen(Game.Screen.wearScreen, this._player.getItems(),'You have nothing to wear on your body.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_EXAMINE) {
            this.showItemsSubScreen(Game.Screen.examineScreen, this._player.getItems(),'You have nothing to examine.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_FLING) {
            this.showItemsSubScreen(Game.Screen.fireFlingScreen, this._player.getItems(),'You have nothing to fire/fling.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_PACK) {
            this.showItemsSubScreen(Game.Screen.packScreen, this._player.getItems(),'You have no containers.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_UNPACK) {
            this.showItemsSubScreen(Game.Screen.unpackScreen, this._player.getItems(),'You have no containers.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_GET) {
            var items = this._player.getMap().getItemsAt(this._player.getX(), this._player.getY(), this._player.getZ());

            // If there is only one item, directly pick it up
            if (items && items.length === 1) { 
                var item = items[0];
                tookAction = true;
                if (this._player.pickupItems([0])) {
                    Game.sendMessage(this._player, "You pick up %s.", [item.describeA()]);
                } else {
                    Game.sendMessage(this._player, "Your inventory is full! Nothing was picked up. Perhaps you could just carry it in your hands...");
                }
                Game.refresh();
            } else {
                this.showItemsSubScreen(Game.Screen.pickupScreen, items,'There is nothing here to pick up.');
                return;
            }

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_GET_TO_HANDS) {
            var items = this._player.getMap().getItemsAt(this._player.getX(), this._player.getY(), this._player.getZ());
            this.showItemsSubScreen(Game.Screen.pickupToHandsScreen, items,'There is nothing here to pick up.');
            return;

        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_CRAFT) {
            Game.sendMessage(this._player, "action INVENTORY_CRAFT not yet implemented"); Game.refresh();
            return;
        } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_USE) {
            Game.sendMessage(this._player, "action INVENTORY_USE not yet implemented"); Game.refresh();
            return;

        //----------------------------
        // world actions
        } else if (gameAction === Game.Bindings.Actions.World.LOOK) {
            var offsets = this.getScreenOffsets();
            Game.Screen.lookScreen.setup(this._player,this._player.getX(), this._player.getY(),offsets.x, offsets.y);
            this.setSubScreen(Game.Screen.lookScreen);
            return;
        } else if (gameAction === Game.Bindings.Actions.World.BUILD) {
            var offsets = this.getScreenOffsets();
//            Game.Screen.lookScreen.setup(this._player,this._player.getX(), this._player.getY(),offsets.x, offsets.y);
//            this.setSubScreen(Game.Screen.lookScreen);
            Game.sendMessage(this._player, "action BUILD not yet implemented"); Game.refresh();
            return;
        } else if (gameAction === Game.Bindings.Actions.World.ACTIVATE) {
            var offsets = this.getScreenOffsets();
//            Game.Screen.lookScreen.setup(this._player,this._player.getX(), this._player.getY(),offsets.x, offsets.y);
//            this.setSubScreen(Game.Screen.lookScreen);
            Game.sendMessage(this._player, "action ACTIVATE not yet implemented"); Game.refresh();
            return;


        //----------------------------
        // meta actions
        } else if (gameAction === Game.Bindings.Actions.Meta.SWITCH_KEYBINDING) {
            if (Game.getControlScheme() === Game.Bindings.BindingSet_Numpad) {
                Game.setControlScheme(Game.Bindings.BindingSet_Laptop);
            } else {
                Game.setControlScheme(Game.Bindings.BindingSet_Numpad);
            }
            Game.AuxScreen.helpScreen.refresh(this.getHelpSections());
            return;

        } else if (gameAction === Game.Bindings.Actions.Meta.HELP) {
            this.setSubScreen(Game.Screen.helpScreenGeneral);
//            if (Game.getControlScheme() === Game.Bindings.BindingSet_Numpad) {
//                this.setSubScreen(Game.Screen.helpScreenNumpad);
//                
//            } else {
//                this.setSubScreen(Game.Screen.helpScreenLaptop);
//            }
//            return;


        //----------------------------
        // movement actions
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_UL) {
            tookAction = this.move(-1, -1, 0);
            this._moveCounter++;
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_U) {
            tookAction = this.move(0, -1, 0);
            this._moveCounter++;
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_UR) {
            tookAction = this.move(1, -1, 0);
            this._moveCounter++;
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_L) {
            tookAction = this.move(-1, 0, 0);
            this._moveCounter++;
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_WAIT) {
            tookAction = true;
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_R) {
            tookAction = this.move(1, 0, 0);
            this._moveCounter++;
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_DL) {
            tookAction = this.move(-1, 1, 0);
            this._moveCounter++;
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_D) {
            tookAction = this.move(0, 1, 0);
            this._moveCounter++;
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_DR) {
            tookAction = this.move(1, 1, 0);
            this._moveCounter++;
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_ASCEND) {
            tookAction = this.move(0, 0, -1);
        } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_DESCEND) {
            tookAction = this.move(0, 0, 1);
        }

        // after 9 moves on the surface the player goes to the next stage of the story
        if (tookAction && Game.getGameStage()=='surface') {
            if (this._moveCounter > (5 + ROT.RNG.getUniform()*10)) {
                this._player.setOgaInterrupt(true);
                this.setSubScreen(Game.Screen.storyScreen);
            }
        }

        Game.AuxScreen.infoScreen.setCurrentShortInfo('');
        Game.AuxScreen.infoScreen.setCurrentDetailInfo('');

        if (tookAction) {
            if (Game.getGameStage()=='surface') {
                if (! this._player.getWearing() || this._player.getWearing().getName() != 'HEM suit') {
                    Game.AuxScreen.infoScreen.setCurrentShortInfo('Your nano-docs can\'t keep up with the combination of the internal hemoraging from low pressue and the lack of oxygen!');
                    Game.AuxScreen.infoScreen.setCurrentDetailInfo('This was a really bad idea. Someone is painting blood all over your eyes while simultaneously reaching into your chest through your mouth in an attempt to pull your lungs inside out.... it\'s.... not pleasant. Maybe you should put your suit back on... If you survive this you should probably get the oxygen flow valve checked once you get back to base - clearly something is messing with your head.');
                    var damage = Game.util.getRandomInteger(3,6);
                    Game.sendMessage(this._player, 'You take %d damage',[damage],'%b{#422}'); 
                    this._player.takeDamage(Game.Entity.Stupidity,damage);
                }
            }
            this._player.finishAction();
            return true;
        }
        
        return false;
    },
    move: function(dX, dY, dZ) { // NOTE: dX, dY, and dZ each are integers ranging from -1 to 1
        dX = Math.floor(dX);
        dY = Math.floor(dY);
        dZ = Math.floor(dZ);
        dX = Math.max(-1,Math.min(1,dX));
        dY = Math.max(-1,Math.min(1,dY));
        dZ = Math.max(-1,Math.min(1,dZ));
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        var newZ = this._player.getZ() + dZ;
        // Try to move to the new cell
        return this._player.tryMove(newX, newY, newZ, this._player.getMap());
    },
    setGameEnded: function(state) {
            this._gameEnded = state;
    },
    getGameEnded: function() {
            return this._gameEnded;
    },
    showItemsSubScreen: function(subScreen, items, emptyMessage) {
        if (items && subScreen.setup(this._player, items) > 0) {
            this.setSubScreen(subScreen);
        } else {
            Game.sendMessage(this._player, emptyMessage);
            Game.refresh();
        }
    }
}


////////////////////////////////////////////////////////////


Game.Screen.ItemListScreen = function(template) {
    this._subScreen = null;
    this._parentScreen = null;

    // Set up based on the template
    this._caption = template['caption'];
    this._okFunction = template['ok'];
    // By default, we use the identity function
    this._isAcceptableFunction = template['isAcceptable'] || function(x) {
        return x;
    }
    
    // Whether the user can select items at all.
    this._canSelectItem = template['canSelect'];

    // Whether the user can select multiple items.
    this._canSelectMultipleItems = template['canSelectMultipleItems'];
    
    // Whether a 'no item' option should appear.
    this._hasNoItemOption = template['hasNoItemOption'];
    
    this._displayIndexLower = 0;
    this._displayIndexUpper = 0;
    this._displayItems;
    this._displayMaxNum = Game.getScreenHeight()-3;
    this._items = [];
    this._itemIdxReverseLookup = {};
};

Game.Screen.ItemListScreen.prototype.getHelpSections = function() {
    return ['inventory','inventory_full','datanav'];
};

Game.Screen.ItemListScreen.prototype.setParentScreen = function(screen) {
    this._parentScreen = screen;
}

// Should be called before switching to the screen.
Game.Screen.ItemListScreen.prototype.setup = function(player, items) {
    this._player = player;
    
    this._items = [];
    this._itemIdxReverseLookup = {};
    for (var i=0;i<items.length;i++) {
        if (this._isAcceptableFunction(items[i])) {
            this._items.push(items[i]);
            this._itemIdxReverseLookup[items[i].getId()] = i;
        }
    }
/*

    var count = 0;
    // Iterate over each item, keeping only the aceptable ones and counting
    // the number of acceptable items.
    var that = this;
    this._items = items.map(function(item) {
        // Transform the item into null if it's not acceptable
        if (that._isAcceptableFunction(item)) {
            count++;
            return item;
        } else {
            return null;
        }
    });
*/

    // Clean set of selected indices
    this._selectedIndices = {}; 
    this._displayIndexLower = 0;
    //this._displayIndexUpper = this._items.length-1;
    this._displayItems = [];
    this.determineDisplayItems();
    return this._items.length;
};

Game.Screen.ItemListScreen.prototype.determineDisplayItems = function() {
//    // start with full slice, and reduce slice until non-null items <= this._displayMaxNum; adjust page up and page down handlers (next two funcs below) similarly
/*
    this._displayIndexUpper = this._items.length-1;
    var protoItems = this._items.slice(this._displayIndexLower,this._displayIndexUpper+1);
    var nonNullCount = protoItems.filter(String).length;
    while (nonNullCount > this._displayMaxNum) {
        this._displayIndexUpper--;
        protoItems = this._items.slice(this._displayIndexLower,this._displayIndexUpper+1);
        nonNullCount = protoItems.filter(String).length;
    }

    console.dir(protoItems);    
    this._displayItems = protoItems;
*/    
    
    this._displayItems = this._items.slice(this._displayIndexLower,this._displayIndexLower+this._displayMaxNum);
}

Game.Screen.ItemListScreen.prototype.handlePageUp = function() {
    //console.log('page up');
    //console.log('this._displayIndexLower='+this._displayIndexLower);
    //console.dir(this._items);    
    //console.dir(this._displayItems);
    //console.log('---');
    this._displayIndexLower -= this._displayMaxNum;
    if (this._displayIndexLower < 0) {
        this._displayIndexLower = 0;
    }
    this.determineDisplayItems();
    //console.log('this._displayIndexLower='+this._displayIndexLower);
    //console.dir(this._items);    
    //console.dir(this._displayItems);
    Game.refresh();
}
Game.Screen.ItemListScreen.prototype.handlePageDown = function() {
    //console.log('page down');
    //console.log('this._displayIndexLower='+this._displayIndexLower);
    //console.dir(this._items);    
    //console.dir(this._displayItems);
    //console.log('---');
    var numUnseenItems = this._items.length - (this._displayIndexLower + this._displayItems.length);
    this._displayIndexLower += this._displayMaxNum;
    if (this._displayIndexLower > this._items.length) {
        this._displayIndexLower -= this._displayMaxNum;
    }    
    //if (this._displayIndexLower >= this._items.length - this._displayMaxNum) {
    //    this._displayIndexLower = Math.max(0,this._items.length - this._displayMaxNum - 1);
    //}    
    this.determineDisplayItems();
    //console.log('this._displayIndexLower='+this._displayIndexLower);
    //console.dir(this._items);    
    //console.dir(this._displayItems);
    Game.refresh();
}

Game.Screen.ItemListScreen.prototype.render = function(display) {
    var letters = 'abcdefghijklmnopqrstuvwxyz';
    
    // Render the caption in the top row
    var captionText = 'Item List';
    if (typeof this._caption == 'function') {
        captionText = this._caption();
    } else {
        captionText = this._caption;
    }
    display.drawText(0, 0, Game.Screen.DEFAULT_COLOR_SETTER + captionText);
    
    var row = 0;
    if (this._hasNoItemOption) {
            display.drawText(0, 1, Game.Screen.DEFAULT_COLOR_SETTER + '0 - no item');
            row++;
    }
    if (this._displayIndexLower > 0) {
            display.drawText(0, 1 + row, '%c{black}%b{yellow}page up for more');
            row++;
    }
    for (var i = 0; i < this._displayItems.length; i++) {
        // If we have an item, we want to render it.
        var trueItemIndex = this._displayIndexLower + i;
        if (this._displayItems[i]) {
            // Get the letter matching the item's index
            var letter = letters.substring(i, i + 1);
            
            // If we have selected an item, show a +, else show a dash between
            // the letter and the item's name.
            var selectionState = (this._canSelectItem && this._canSelectMultipleItems &&
                this._selectedIndices[trueItemIndex]) ? '+' : '-';
            
            var weightNote = (this._items[trueItemIndex].getInvWeight()/1000) + ' kg';
            var bulkNote = (this._items[trueItemIndex].getInvBulk()/1000) + ' L';

            // Check if the item is worn or holdInHandsed
            var suffix = '';
            if (this._items[trueItemIndex] === this._player.getWearing()) {
                suffix = ' (wearing)';
                bulkNote = 'worn';
            } else if (this._items[trueItemIndex] === this._player.getHolding()) {
                suffix = ' (holding)';
                bulkNote = 'in hand';
            }
            

            // Render at the correct row and add 1
            var item_symbol = this._displayItems[i].getColorDesignator()+this._displayItems[i].getChar()+Game.Screen.DEFAULT_COLOR_SETTER;
            display.drawText(0, 1 + row, Game.Screen.DEFAULT_COLOR_SETTER + letter + ' ' + selectionState + ' ' + item_symbol + ' ' +this._displayItems[i].getName() + suffix);
            display.drawText(50, 1 + row, weightNote);
            display.drawText(65, 1 + row, bulkNote);
            row++;
        }
    }
    if ((this._displayIndexLower + this._displayItems.length) < this._items.length) {
            display.drawText(0, 1 + row, '%c{black}%b{yellow}page down for more');
            row++;
    }
};

Game.Screen.ItemListScreen.prototype.executeOkFunction = function() {
    // Gather the selected items.
    var selectedItems = {};
    for (var key in this._selectedIndices) {
        var trueKey = this._itemIdxReverseLookup[this._items[key].getId()];
        selectedItems[trueKey] = this._items[key];
    }
    // Switch back to the play screen.
    Game.Screen.playScreen.setSubScreen(undefined);
    
    // Call the OK function and end the player's turn if it returns true.
    if (this._okFunction(selectedItems)) {
        this._player.finishAction();
    }
};

Game.Screen.ItemListScreen.prototype.handleInput = function(inputType, inputData) {
    //console.dir(inputType);
    //console.dir(inputData);
    if (inputType === 'keydown') {
        // If the user hit escape, hit enter and can't select an item, or hit
        // enter without any items selected, simply cancel out
        if (inputData.keyCode === ROT.VK_ESCAPE || 
            (inputData.keyCode === ROT.VK_RETURN && 
                (!this._canSelectItem || Object.keys(this._selectedIndices).length === 0))) {
            Game.Screen.playScreen.setSubScreen(undefined);

        // Handle pressing return when items are selected
        } else if (inputData.keyCode === ROT.VK_RETURN) {
            this.executeOkFunction();

        // Handle pressing zero when 'no item' selection is enabled
        } else if (this._canSelectItem && this._hasNoItemOption && inputData.keyCode === ROT.VK_0) {
            this._selectedIndices = {};
            this.executeOkFunction();

        // Handle pressing a letter if we can select
        } else if (this._canSelectItem && inputData.keyCode >= ROT.VK_A &&
            inputData.keyCode <= ROT.VK_Z) {
            // Check if it maps to a valid item by subtracting 'a' from the character
            // to know what letter of the alphabet we used.
            var index = inputData.keyCode - ROT.VK_A;
            var trueItemIndex = this._displayIndexLower + index;
            if (this._items[trueItemIndex]) {
                // If multiple selection is allowed, toggle the selection status, else
                // select the item and exit the screen
                if (this._canSelectMultipleItems) {
                    if (this._selectedIndices[trueItemIndex]) {
                        delete this._selectedIndices[trueItemIndex];
                    } else {
                        this._selectedIndices[trueItemIndex] = true;
                    }
                    // Redraw screen
                    Game.refresh();
                } else {
                    this._selectedIndices[trueItemIndex] = true;
                    this.executeOkFunction();
                }
            }
        } else {
            var gameAction = Game.Bindings.getAction(inputType, inputData, Game.getControlScheme());

            //----------------------------
            // data nav actions
            if (gameAction === Game.Bindings.Actions.DataNav.PAGE_UP) {
                //console.log('page up');
                this.handlePageUp();
        //        this._parentScreen.showItemsSubScreen(Game.Screen.dropScreen, this._player.getItems(),'You have nothing to drop.');
                return;
            } else if (gameAction === Game.Bindings.Actions.DataNav.PAGE_DOWN) {
                //console.log('page down');
                this.handlePageDown();
        //        this._parentScreen.showItemsSubScreen(Game.Screen.examineScreen, this._player.getItems(),'You have nothing to examine.');
                return;
            }
        }
    }
};

//-------------------

Game.Screen.inventoryScreen = new Game.Screen.ItemListScreen({
    caption: function() {
        return 'Inventory      '+this._player.getInvenLimitsSummary(); //getWeightStatusColor()+'mass: '+this._player.getWeightStatusString()+Game.Screen.DEFAULT_COLOR_SETTER+'       '+this._player.getBulkStatusColor()+'volume: '+this._player.getBulkStatusString();
    },
    canSelect: false,
    
});

Game.Screen.inventoryScreen.handleInput = function(inputType, inputData) {
//    console.dir(inputType);
//    console.dir(inputData);

    if ((inputData.keyCode === ROT.VK_ESCAPE) || (inputData.keyCode === ROT.VK_RETURN)) {
        Game.Screen.playScreen.setSubScreen(undefined);
    }

    var gameAction = Game.Bindings.getAction(inputType, inputData, Game.getControlScheme());

    //----------------------------
    // inventory actions
    if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_DROP) {
        this._parentScreen.showItemsSubScreen(Game.Screen.dropScreen, this._player.getItems(),'You have nothing to drop.');
        return;

    } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_EAT) {
        this._parentScreen.showItemsSubScreen(Game.Screen.eatScreen, this._player.getItems(),'You have nothing to eat.');
        return;

    } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_HOLD) {
        this._parentScreen.showItemsSubScreen(Game.Screen.holdScreen, this._player.getItems(),'You have nothing to hold in your hands.');
        return;

    } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_WEAR) {
        this._parentScreen.showItemsSubScreen(Game.Screen.wearScreen, this._player.getItems(),'You have nothing to wear on your body.');
        return;

    } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_EXAMINE) {
        this._parentScreen.showItemsSubScreen(Game.Screen.examineScreen, this._player.getItems(),'You have nothing to examine.');
        return;
        
    } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_FLING) {
        this._parentScreen.showItemsSubScreen(Game.Screen.fireFlingScreen, this._player.getItems(),'You have nothing to fire/fling.');
        return;

    } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_PACK) {
        this._parentScreen.showItemsSubScreen(Game.Screen.packScreen, this._player.getItems(),'You have no containers.');
        return;

    } else if (gameAction === Game.Bindings.Actions.Inventory.INVENTORY_UNPACK) {
        this._parentScreen.showItemsSubScreen(Game.Screen.unpackScreen, this._player.getItems(),'You have no containers.');
        return;
    }
    
    //----------------------------
    // data nav actions
    if (gameAction === Game.Bindings.Actions.DataNav.PAGE_UP) {
        //console.log('page up');
        this.handlePageUp();
//        this._parentScreen.showItemsSubScreen(Game.Screen.dropScreen, this._player.getItems(),'You have nothing to drop.');
        return;
    } else if (gameAction === Game.Bindings.Actions.DataNav.PAGE_DOWN) {
        //console.log('page down');
        this.handlePageDown();
//        this._parentScreen.showItemsSubScreen(Game.Screen.examineScreen, this._player.getItems(),'You have nothing to examine.');
        return;
    }
}

Game.Screen.inventoryScreen.getHelpSections = function() {
    return ['inventory','inventory_advanced','datanav'];
};


//-------------------

Game.Screen.pickupScreen = new Game.Screen.ItemListScreen({
    caption: function() {
        return 'Pick up      '+this._player.getInvenLimitsSummary();
    },
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems) {
        // Try to pick up all items, messaging the player if they couldn't all be
        // picked up.
        if (!this._player.pickupItems(Object.keys(selectedItems))) {
            Game.sendMessage(this._player, "Your inventory is full! Not all items were picked up.");
        }
        return true;
    }
});

Game.Screen.pickupScreen.getHelpSections = function() {
    return ['datanav'];
};

//-------------------

Game.Screen.pickupToHandsScreen = new Game.Screen.ItemListScreen({
    caption: 'Carry in you hands',
    canSelect: true,
    canSelectMultipleItems: false,
    ok: function(selectedItems) {
        var key = Object.keys(selectedItems)[0];
        var item = selectedItems[key];
        //var heldItem = this._player.getHolding();
        //this._player.forceAddItem(item);
        this._player.holdInHands(item);
        this._player.getMap().extractItem(item,this._player.getX(),this._player.getY(),this._player.getZ());
        return true;
    }
});

Game.Screen.pickupToHandsScreen.getHelpSections = function() {
    return ['datanav'];
};

//-------------------

Game.Screen.dropScreen = new Game.Screen.ItemListScreen({
    caption: function() {
        return 'Drop      '+this._player.getInvenLimitsSummary();
    },
//    caption: 'Choose the items you wish to drop',
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems) {
        // Drop the selected item
        this._player.dropItems(Object.keys(selectedItems));
        return true;
    }
});

Game.Screen.dropScreen.getHelpSections = function() {
    return ['datanav'];
};

//-------------------

Game.Screen.eatScreen = new Game.Screen.ItemListScreen({
    caption: 'Eat',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return item && item.hasMixin('Edible');
    },
    ok: function(selectedItems) {
        // Eat the item, removing it if there are no consumptions remaining.
        var key = Object.keys(selectedItems)[0];
        var item = selectedItems[key];
        
        this._player.eat(item);
//        if (!item.hasRemainingConsumptions()) {
//            this._player.removeItem(key);
//        }
        return true;
    }
});

Game.Screen.eatScreen.getHelpSections = function() {
    return ['datanav'];
};


//-------------------

Game.Screen.holdScreen = new Game.Screen.ItemListScreen({
    caption: 'Carry in your hands',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && true;
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.stowFromHands();
            Game.sendMessage(this._player, "You are empty handed.")
        } else {
            var item = selectedItems[keys[0]];
            console.log('trying to hold:');
            console.dir(item);
            this._player.holdInHands(this._player.extractThisItem(item));
            Game.sendMessage(this._player, "You are holding %s.", [item.describeA()]);
            //console.dir(this._player);
        }
        return true;
    }
});

Game.Screen.holdScreen.getHelpSections = function() {
    return ['datanav'];
};


//-------------------

Game.Screen.wearScreen = new Game.Screen.ItemListScreen({
    caption: 'Wear',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.isArmor();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.stowFromBody();
            Game.sendMessage(this._player, "You are not wearing anthing.")
        } else {
            var item = selectedItems[keys[0]];
            this._player.wear(this._player.extractThisItem(item));
            Game.sendMessage(this._player, "You are wearing %s.", [item.describeA()]);
        }
        return true;
    }
});

Game.Screen.wearScreen.getHelpSections = function() {
    return ['datanav'];
};


//-------------------

Game.Screen.fireFlingScreen = new Game.Screen.ItemListScreen({
    caption: 'Fire/fling',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item;
    },
    ok: function(selectedItems) {
        var keys = Object.keys(selectedItems);
        if (keys.length > 0) {
            var item = selectedItems[keys[0]];
            this.setAmmo(this._player.extractThisItem(item));

            var offsets = Game.Screen.playScreen.getScreenOffsets();
            Game.Screen.rangedTargetScreen.setup(this._player,this._player.getX(), this._player.getY(),offsets.x, offsets.y);
            this._parentScreen.setSubScreen(Game.Screen.rangedTargetScreen);
        }
        return false;
    }
});

Game.Screen.fireFlingScreen.getHelpSections = function() {
    return ['datanav'];
};

Game.Screen.fireFlingScreen.setAmmo = function(item) {
    this._ammo = item;
}
Game.Screen.fireFlingScreen.getAmmo = function() {
    return this._ammo;
}
Game.Screen.fireFlingScreen.clearAmmo = function() {
    return this._ammo = undefined;
}
//-------------------

Game.Screen.examineScreen = new Game.Screen.ItemListScreen({
    caption: function() {
        return 'Examine      '+this._player.getInvenLimitsSummary();
    },
//    caption: 'Choose the item you wish to examine',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return true;
    },
    ok: function(selectedItems) {
        var keys = Object.keys(selectedItems);
        if (keys.length > 0) {
            var item = selectedItems[keys[0]];
//            Game.sendMessage(this._player, item.details());
            Game.AuxScreen.infoScreen.setCurrentShortInfo(item.details());
            var descr = item.getDescription();
            if (descr) {
//                Game.sendMessage(this._player, descr);
                Game.AuxScreen.infoScreen.setCurrentDetailInfo(descr);

            }
            //Game.sendMessage(this._player, '');

        }
        Game.refresh();
        return false;
    }
});

Game.Screen.examineScreen.getHelpSections = function() {
    return ['datanav'];
};

//-------------------

Game.Screen.packScreen = new Game.Screen.ItemListScreen({
    caption: 'Pack',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return item && item.hasMixin('Container');
    },
    ok: function(selectedItems) {
        //console.log('container to pack has been selected');
        Game.Screen.packScreen.selectedContainer = selectedItems[(Object.keys(selectedItems))[0]];
        this._parentScreen.showItemsSubScreen(Game.Screen.packItemSelectionScreen, this._player.getItems(),'You have nothing to pack.');
        return;
    }
});

Game.Screen.packScreen.getHelpSections = function() {
    return ['datanav'];
};

Game.Screen.packScreen.selectedContainer = '';

//-------------------

Game.Screen.packItemSelectionScreen = new Game.Screen.ItemListScreen({
    caption: function() {
        return 'Choose items to pack';
    },
    canSelect: true,
    canSelectMultipleItems: true,
    isAcceptable: function(item) {
        return item && item != Game.Screen.packScreen.selectedContainer;
    },
    ok: function(selectedItems) {
        var targetContainer = Game.Screen.packScreen.selectedContainer;

        // Pack the selected items
        //console.log('items to pack in container have been selected');
        //console.dir(selectedItems);
        
        var indices = Object.keys(selectedItems);
        var numPacked = 0;
        
        for (var i=0; i<indices.length;i++) {
            var itm = selectedItems[indices[i]];
            if (targetContainer.canAddItem(itm)) {
                targetContainer.addItems([itm]);
                this._player.extractThisItem(itm);
                numPacked++;
            }
        }
        
        if (numPacked < indices.length) {
            Game.sendMessage(this._player,'Not everything fits into %s',[targetContainer.describeThe()]);
        }
        
        //console.dir(targetContainer);
        
        this._player.setLastActionDuration(targetContainer.getAccessDuration());
        
        return true;
    }
});

Game.Screen.packItemSelectionScreen.getHelpSections = function() {
    return ['datanav'];
};

//-------------------

Game.Screen.unpackScreen = new Game.Screen.ItemListScreen({
    caption: 'Unpack',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return item && item.hasMixin('Container');
    },
    ok: function(selectedItems) {
        //console.log('item to unpack has been selected');
        Game.Screen.unpackScreen.selectedContainer = selectedItems[(Object.keys(selectedItems))[0]];
        this._parentScreen.showItemsSubScreen(Game.Screen.unpackItemSelectionScreen, Game.Screen.unpackScreen.selectedContainer.getItems(),'You have nothing to unpack.');
        return;
    }
});

Game.Screen.unpackScreen.getHelpSections = function() {
    return ['datanav'];
};

Game.Screen.unpackScreen.selectedContainer = '';

//-------------------

Game.Screen.unpackItemSelectionScreen = new Game.Screen.ItemListScreen({
    caption: function() {
        return 'Choose items to unpack';
    },
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems) {
        var targetContainer = Game.Screen.unpackScreen.selectedContainer;
        var pMap = this._player.getMap();
        var px = this._player.getX();
        var py = this._player.getY();
        var pz = this._player.getZ();
        
        // unpack the selected items
        //console.log('items to unpack from container have been selected');
        var indices = Object.keys(selectedItems);
        var unpackedItems = targetContainer.extractItemsAt(indices);
        var numDroppedItems = 0;
        for (var i=0; i<unpackedItems.length; i++) {
            var itm = unpackedItems[i];
            if (! this._player.addItem(itm)) {
                if (pMap) {
                    pMap.addItem(px, py, pz, itm);
                    itm.raiseEvent('onDropped', pMap, px, py, pz);
                    numDroppedItems++;
                }
            }
        }
        
        if (numDroppedItems > 0) {
            Game.sendMessage(this._player,'You could not carry everything that you took out of %s, so some things were dropped',[targetContainer.describeThe()]);
        }
        
        this._player.setLastActionDuration(targetContainer.getAccessDurationUnpack());

        return true;
    }
});

Game.Screen.unpackItemSelectionScreen.getHelpSections = function() {
    return ['datanav'];
};

//-------------------

Game.Screen.craftStep1Screen = new Game.Screen.ItemListScreen({
    caption: function() {
        return 'Choose items for crafting';
    },
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems) {

        console.log('TODO: implement crafting step 2');
        
        // get list of recipes that are elegible given the selected items
        // this._parentScreen.showItemsSubScreen(Game.Screen.craftStep2Screen, viableRecipes,'No recipes using those items.');
        

        return true;
    }
});

Game.Screen.craftStep1Screen.getHelpSections = function() {
    return ['datanav'];
};

////////////////////////////////////////////////////////////

Game.Screen.gainStatScreen = {
    _subScreen: null,
    _parentScreen: null,
    enter: function() {
        Game.AuxScreen.helpScreen.refresh(this.getHelpSections());
    },
    setup: function(entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._options = entity.getStatOptions();
    },
    setParentScreen: function(screen) {
        this._parentScreen = screen;
    },
    getHelpSections: function() {
        return [];
    },
    render: function(display) {
        if (this._parentScreen) {
            this._parentScreen.renderTiles(display);
            this._parentScreen.renderPlayerMessages(display);
            this._parentScreen.renderPlayerStats(display);
        }
        
        var lines = display.drawText(0, 0, "Your nano-docs are really working overtime, scavenging whatever bio-compatible materials they can from the environment to patch you together and help you adapt. It's actually a little scary how effective they are - they weren't described  during your mission prep as being this pro-active. Hopefully nothing has gone wrong...");
        
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(0, lines+1, 'Choose a stat to increase: ');

        // Iterate through each of our options
        for (var i = 0; i < this._options.length; i++) {
            display.drawText(0, lines+3 + i, 
                letters.substring(i, i + 1) + ' - ' + this._options[i][0]);
        }

        // Render remaining stat points
        display.drawText(0, lines+5 + this._options.length,
            "Remaining points: " + this._entity.getStatPoints());   
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            // If a letter was pressed, check if it matches to a valid option.
            if (inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z) {
                // Check if it maps to a valid item by subtracting 'a' from the character
                // to know what letter of the alphabet we used.
                var index = inputData.keyCode - ROT.VK_A;
                if (this._options[index]) {
                    // Call the stat increasing function
                    this._options[index][1].call(this._entity);
                    // Decrease stat points
                    this._entity.setStatPoints(this._entity.getStatPoints() - 1);
                    // If we have no stat points left, exit the screen, else refresh
                    if (this._entity.getStatPoints() == 0) {
                        Game.Screen.playScreen.setSubScreen(undefined);
                    } else {
                        Game.refresh();
                    }
                }
            }
        }
    }
};

////////////////////////////////////////////////////////////

Game.Screen.TargetBasedScreen = function(template) {
    template = template || {};
    
    this._subScreen = null;
    this._parentScreen = null;

    // By default, our ok return does nothing and does not consume a turn.
    this._okFunction = template['okFunction'] || function(x, y) {
        return false;
    };
    // The defaut caption function simply returns an empty string.
    this._captionFunction = template['captionFunction'] || function(x, y) {
        return '';
    }
    
    this._lastTargetEnt = null;
    this._lastTargetCoord = null;
};

Game.Screen.TargetBasedScreen.prototype.getHelpSections = function() {
    return ['movement','targeting'];
};

Game.Screen.TargetBasedScreen.prototype.setParentScreen = function(screen) {
    this._parentScreen = screen;
}


Game.Screen.TargetBasedScreen.prototype.setup = function(player, startX, startY, offsetX, offsetY) {
    this._player = player;
    
    // Store original position. Subtract the offset to make life easy so we don't
    // always have to remove it.
    this._startX = startX - offsetX;
    this._startY = startY - offsetY;
    
    // Store current cursor position
    this._cursorX = this._startX;
    this._cursorY = this._startY;
    
    // Store map offsets
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    
    // Cache the FOV
    var visibleCells = {};
    this._player.getMap().getFov(this._player.getZ()).compute(
        this._player.getX(), this._player.getY(), 
        this._player.getSightRadius(), 
        function(x, y, radius, visibility) {
            visibleCells[x + "," + y] = true;
        });
    this._visibleCells = visibleCells;
    
    Game.AuxScreen.helpScreen.refresh(this.getHelpSections());
};

/*
Game.Screen.TargetBasedScreen.prototype.renderPlayerMessages = function(display) {
    // Get the messages in the player's queue and render them
    var messages = this._player.getMessages();
    var messageY = 0;
    for (var i = 0; i < messages.length; i++) {
        // Draw each message, adding the number of lines
        messageY += display.drawText(
            0, 
            messageY,
            Game.Screen.DEFAULT_COLOR_SETTER + messages[i]
        );
    }
}
*/

Game.Screen.TargetBasedScreen.prototype.render = function(display) {
    Game.Screen.playScreen.renderTiles.call(Game.Screen.playScreen, display);
    //console.log('TargetBasedScreen render A');

    // Draw a line from the cursor to the start.
    var points = Game.Geometry.getLine(this._cursorX,this._cursorY,this._startX, this._startY);


    //console.log('TargetBasedScreen render B');
    display.drawText(points[0].x, points[0].y, '%c{yellow}*');

    // Render stars along the line. (stop before the last node - don't cover up the player!)
    for (var i = 1, l = points.length-1; i < l; i++) {
        display.drawText(points[i].x, points[i].y, '%c{magenta}*');
    }

    //console.log('TargetBasedScreen render C');

//    // Render the caption at the bottom.
//    display.drawText(0, Game.getScreenHeight() - 1, 
//        this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
    
    Game.AuxScreen.infoScreen.setCurrentShortInfo(this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));

    //console.log('TargetBasedScreen render D');
};

Game.Screen.TargetBasedScreen.prototype.moveCursorToLastTarget = function() {
//    console.log('moveCursorToLastTarget');
    var tX_map = this._player.getX();
    var tY_map = this._player.getY();
    var msg = '';
    if (this._lastTargetEnt && this._lastTargetEnt.isAlive()) {
        // if entity is dead or out of range, clearLastTarget instead
        tX_map = this._lastTargetEnt.getX();
        tY_map = this._lastTargetEnt.getY();
        msg = 'using prior target '+this._lastTargetEnt.getName();
    } else if (this._lastTargetCoord) {
        // if coord is out of range, clearLastTarget instead
        tX_map = this._lastTargetCoord.x;
        tY_map = this._lastTargetCoord.y;
        msg = 'using prior target location';
    } else {
        Game.sendMessage(this._player,'prior target not available');
        this.clearLastTarget();
        return false;
    }

    if (this._player.canSeeCoord(tX_map,tY_map)) {
        this._cursorX = tX_map - this._offsetX;
        this._cursorY = tY_map - this._offsetY;
        Game.sendMessage(this._player,msg);
        return true;
    } else {
        Game.sendMessage(this._player,'prior target not visible');
        this.clearLastTarget();
        return false;
    }
}

Game.Screen.TargetBasedScreen.prototype.setLastTarget = function(lastTarget) {
//    console.log('setLastTarget');
    if (lastTarget instanceof Game.Entity) {
        this._lastTargetEnt = lastTarget;
        this._lastTargetCoord = null;
        Game.sendMessage(this._player,'set target to '+lastTarget.getName());
    } else if (lastTarget) {
        this._lastTargetEnt = null;
        this._lastTargetCoord = lastTarget;
        Game.sendMessage(this._player,'set target location');
    } else {
        this.clearLastTarget();
    }
}

Game.Screen.TargetBasedScreen.prototype.clearLastTarget = function() {
//    console.log('clearLastTarget');
        this._lastTargetEnt = null;
        this._lastTargetCoord = null;
        this._cursorX = this._player.getX() - this._offsetX;
        this._cursorY = this._player.getY() - this._offsetY;
        //Game.sendMessage(this._player,'cleared prior target');
}

Game.Screen.TargetBasedScreen.prototype.handleInput = function(inputType, inputData) {

    var gameAction = Game.Bindings.getAction(inputType, inputData, Game.getControlScheme());

    if (gameAction === Game.Bindings.Actions.Moves.MOVE_UL) {
        tookAction = this.moveCursor(-1, -1);
    } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_U) {
        tookAction = this.moveCursor(0, -1);
    } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_UR) {
        tookAction = this.moveCursor(1, -1);
    } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_L) {
        tookAction = this.moveCursor(-1, 0);
    } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_R) {
        tookAction = this.moveCursor(1, 0);
    } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_DL) {
        tookAction = this.moveCursor(-1, 1);
    } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_D) {
        tookAction = this.moveCursor(0, 1);
    } else if (gameAction === Game.Bindings.Actions.Moves.MOVE_DR) {
        tookAction = this.moveCursor(1, 1);
    } else if (gameAction === Game.Bindings.Actions.Targeting.USE_OLD_TARGET) {
        this._player.clearMessages();
        tookAction = this.moveCursorToLastTarget();
    } else if (gameAction === Game.Bindings.Actions.Targeting.CLEAR_OLD_TARGET) {
        this._player.clearMessages();
        tookAction = this.clearLastTarget();
        Game.sendMessage(this._player,'cleared prior target');
    } else if (inputData.keyCode === ROT.VK_ESCAPE) {

        var ammo = Game.Screen.fireFlingScreen.getAmmo();
        if (ammo) {
            Game.Screen.fireFlingScreen.clearAmmo();
            Game.Screen.playScreen._player.addItem(ammo);
        }

        this._player.clearMessages();
        Game.AuxScreen.infoScreen.setCurrentShortInfo('');
        Game.AuxScreen.infoScreen.setCurrentDetailInfo('');
        this._parentScreen.setSubScreen(undefined);
        this.setParentScreen(undefined);
    } else if (inputData.keyCode === ROT.VK_RETURN) {
        this._player.clearMessages();
        this.executeOkFunction();
    }

    Game.refresh();
};

Game.Screen.TargetBasedScreen.prototype.moveCursor = function(dx, dy) {
    // Make sure we stay within bounds.
    var newX = Math.max(0, Math.min(this._cursorX + dx, Game.getScreenWidth()));
    // We have to save the last line for the caption.
    var newY = Math.max(0, Math.min(this._cursorY + dy, Game.getScreenHeight() - 1));

//    // CSW NOTE: this supports targeting tiles outsite the visible range, but the base targetting screen prohibits that. 
//    // make sure target cursor remains in visible range
//    if (this._visibleCells[newX + "," + newY]) {
//        this._cursorX = newX;
//        this._cursorY = newY;
//    } else {
//        // Render the caption at the bottom.
//        display.drawText(0, Game.getScreenHeight() - 1,'You cannot target anything beyond your sight');
//    }
    this._cursorX = newX;
    this._cursorY = newY;
};

Game.Screen.TargetBasedScreen.prototype.executeOkFunction = function() {
    // Switch back to the play screen.
    Game.AuxScreen.infoScreen.setCurrentShortInfo('');
    Game.AuxScreen.infoScreen.setCurrentDetailInfo('');
    
    this._parentScreen.setSubScreen(undefined);
    this.setParentScreen(undefined);
    
//    console.log('executeOkFunction');
    var realX = this._cursorX + this._offsetX;
    var realY = this._cursorY + this._offsetY;
    var targetChoice = {x:realX,y:realY};
    var ent = this._player.getMap().getEntityAt(targetChoice.x,targetChoice.y,this._player.getZ());
    if (ent) {
        targetChoice = ent;
    }
    this.setLastTarget(targetChoice);

    // Call the OK function and end the player's turn if it return true.
    if (this._okFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY)) {
        this._player.finishAction();
    }
};

//-------------------


Game.Screen.lookScreen = new Game.Screen.TargetBasedScreen({
    captionFunction: function(x, y) {
        var z = this._player.getZ();
        var map = this._player.getMap();
        var fullyLightMap = (map.getMapLightingType() == 'fullLight');
        var captionStr = '';
        var detailsStr = '';
        
        // If the tile is explored, we can give a better capton
        if (fullyLightMap || map.isExplored(x, y, z)) {
            // If the tile isn't explored, we have to check if we can actually 
            // see it before testing if there's an entity or item.
            if (fullyLightMap || this._visibleCells[x + ',' + y]) {
                var items = map.getItemsAt(x, y, z);

                // If we have entities, we want to deal with them first
                if (map.getEntityAt(x, y, z)) {
                    var entity = map.getEntityAt(x, y, z);

                    detailsStr += entity.getName()+': '+entity.getDescription()+"\n\n";

                    if (entity.details()) {
                        captionStr += String.format("%s - %s (%s)",entity.getRepresentation(),entity.describeA(true),entity.details());
                    } else {
                        captionStr += String.format("%s - %s",entity.getRepresentation(),entity.describeA(true));
                    }

                // Else check if there's are any items
                }
                
                if (items) {
                    var item = items[items.length - 1];

                    if (items.length > 1) {
                        Game.sendMessage(this._player,'there are several things piled up here - you can only see clearly the one on the top');
                    }
                    detailsStr += item.getName()+': '+item.getDescription()+"\n";

                    if (captionStr) {
                        captionStr += ' with ';
                    }
                    if (item.details()) {
                        captionStr += String.format('%s - %s (%s)',item.getRepresentation(), item.describeA(true),item.details());
                    } else {
                        captionStr += String.format('%s - %s',item.getRepresentation(),item.describeA(true));
                    }
                }
            }
            // add the tile information.
            var t = map.getTile(x, y, z);
            var dug = map.getDigStatus(x, y, z);
            var diggingDescr = '';
            if (dug > 0) {
                var dugPercent = dug / t.getDigResistance();
                if (dugPercent < .2) {
                    diggingDescr = 'lightly scratched at';
                } else
                if (dugPercent < .4) {
                    diggingDescr = 'pretty scratched at';
                } else
                if (dugPercent < .6) {
                    diggingDescr = 'clearly worked at';
                } else
                if (dugPercent < .8) {
                    diggingDescr = 'beginning to come apart';
                } else {
                    diggingDescr = 'almost falling apart';
                }                
            }
            if (captionStr) {
                captionStr += ' on ';
            }
            captionStr +=  String.format('%s - %s %s',map.getTile(x, y, z).getRepresentation(),map.getTile(x, y, z).getDescription(),diggingDescr);

            Game.AuxScreen.infoScreen.setCurrentDetailInfo(detailsStr);
            return captionStr;
        } else {
            // If the tile is not explored, show the null tile description.
            return String.format('%s - %s',
                Game.Tile.nullTile.getRepresentation(),
                Game.Tile.nullTile.getDescription());
        }
    }
});

//-------------------

Game.Screen.rangedTargetScreen = new Game.Screen.TargetBasedScreen({
    captionFunction: function(x, y) {
        var z = this._player.getZ();
        var map = this._player.getMap();
        var fullyLightMap = (map.getMapLightingType() == 'fullLight');
        
        // If the tile is explored, we can give a better capton
        if (fullyLightMap || map.isExplored(x, y, z)) {
            // If the tile isn't explored, we have to check if we can actually 
            // see it before testing if there's an entity or item.
            if (fullyLightMap || this._visibleCells[x + ',' + y]) {
                var items = map.getItemsAt(x, y, z);

                // deal with entities if there are any, otherwise items
                if (map.getEntityAt(x, y, z)) {
                    var entity = map.getEntityAt(x, y, z);

                    if (entity.details()) {
                        return String.format("%s - %s (%s)",
                            entity.getRepresentation(),
                            entity.describeA(true),
                            entity.details());
                    }
                    return String.format("%s - %s",
                        entity.getRepresentation(),
                        entity.describeA(true));
                } else if (items) {
                    var item = items[items.length - 1];

                    if (items.length > 1) {
                        Game.sendMessage(this._player,'there are several things piled up here - you can only see clearly the one on the top');
                    }

                    if (item.details()) {
                        return String.format('%s - %s (%s)',
                            item.getRepresentation(),
                            item.describeA(true),
                            item.details());
                    }
                    return String.format('%s - %s',
                        item.getRepresentation(),
                        item.describeA(true));
                }
            }
            // If there was no entity/item or the tile wasn't visible, then use
            // the tile information.
            return String.format('%s - %s',
                map.getTile(x, y, z).getRepresentation(),
                map.getTile(x, y, z).getDescription());

        } else {
            // If the tile is not explored, show the null tile description.
            return String.format('%s - %s',
                Game.Tile.nullTile.getRepresentation(),
                Game.Tile.nullTile.getDescription());
        }
    },
    okFunction: function(x, y) {
        var player = this._player;
        var z = player.getZ();
        var map = player.getMap();
        var ammo = Game.Screen.fireFlingScreen.getAmmo();
         
        if (! ammo) {
            this._parentScreen.setSubScreen(undefined);
            this.setParentScreen(undefined);
            return false;
        }

        // NOTE: returning true at this point - from here on out an action is used!
        
        // get the line from the player to the target location
        // drop the item from the player's inventory

        // set potential next space to space 2 in the path (i.e. NOT on/under the player)

        // step through the path:
        // if there's an entity there that's not the player, done 
        //      if entity is not allied, do damage; nuke item if it's depletable, otherwise update its position to the potential space
        //      else (entity is ally), done (leave item at previous tile)
        // else if tile is NOT passable, done (leave item at previous tile)
        // else [no entity, no blocking tile, not target]
        //      update item position to potential tile
        //      spaces traveled ++
        //      if spaces traveled >= max range, done
        //          else, set potential tile to be the next tile in the path
        
        var maxRange = player.getSightRadius()+2;
        
//        player.extractItem(player.getItems().indexOf(ammo));
//        player.extractThisItem(ammo);
        
        var path = Game.Geometry.getLine(player.getX(), player.getY(), x, y);
        map.addItem(path[0].x,path[0].y,z,ammo);

        var pathIdx = 1;
        var rangeTraveled = 0;
        var potentialPosition = {x:player.getX(),y:player.getY()};
        var hasLanded = false;
        while (path.length > pathIdx) {
            potentialPosition = path[pathIdx];

            var ent = map.getEntityAt(potentialPosition.x,potentialPosition.y,z);
            if (ent) {
                if (player.isAlliedWith(ent)) {
                    ammo.raiseEvent('onLanded',map,path[pathIdx-1].x,path[pathIdx-1].y,z);
                    hasLanded = true;
                    setTimeout(function(){
                        Game.sendMessage(player,'You manage to avoid hitting your friend.');
                        Game.refresh();
                        },100);
                } else {
                    ammo.raiseEvent('onLanded',map,potentialPosition.x,potentialPosition.y,z);
                    hasLanded = true;
                    if (ammo.hasMixin('Ammo')) {
                        player.rangedAttack(ent,ammo);
                        if (ROT.RNG.getUniform() < ammo.getReuseChance()) {
                            map.extractItem(ammo,path[pathIdx-1].x,path[pathIdx-1].y,z);
                            map.addItem(potentialPosition.x,potentialPosition.y,z,ammo);
                            Game.sendMessage(player,"The %s can probably be recovered",[ammo.getName()]);
                        } else {
                            map.removeItem(ammo,path[pathIdx-1].x,path[pathIdx-1].y,z);
                            Game.sendMessage(player,"Well, that %s certainly won't be used again",[ammo.getName()]);
                        }
                    }
                }
                Game.refresh();
                break;
            }
            
            var tile = map.getTile(potentialPosition.x,potentialPosition.y,z);
            if (! tile.isAirPassable()) {
                ammo.raiseEvent('onLanded',map,path[pathIdx-1].x,path[pathIdx-1].y,z);
                hasLanded = true;
                break;
            }

            // move the item 1 space
            map.extractItem(ammo,path[pathIdx-1].x,path[pathIdx-1].y,z);
            map.addItem(potentialPosition.x,potentialPosition.y,z,ammo);

            rangeTraveled++;
            Game.refresh();
            // CSW NOTE: probably will need to turn this whole thing into a functional recursive process to deal with timeouts so the item is actually seen by the player in its new position
            
            if (rangeTraveled >= maxRange) {
                ammo.raiseEvent('onLanded',map,potentialPosition.x,potentialPosition.y,z);
                hasLanded = true;
                break;
            }

            pathIdx++;
        }
        
        if (! hasLanded) {
            ammo.raiseEvent('onLanded',map,potentialPosition.x,potentialPosition.y,z);
        }

        Game.Screen.fireFlingScreen.clearAmmo();

        return true;
    }
});


////////////////////////////////////////////////////////////

Game.Screen.helpScreenGeneral = {
    render: function(display) {
        var baseColor = '%c{#ccc}';
        var whiteColor = '%c{#fff}';
        var text =   'CAVES of MARS';
        var border = '-------------';
        var y = 0;
        //display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, whiteColor+text);
        //display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, whiteColor+border);

        y += 1 + display.drawText(1, y++, baseColor+'Caves of Mars is a rogue-like adventure game. Your character, shown as '+Game.getPlayer().getRepresentation()+baseColor+' in the center of the screen, explores the world, fights enemies, finds and makes useful things, gets more powerful, and generally tries to survive and to beat the final big enemy to win the game.');

        y += 1 + display.drawText(1, y++, baseColor+'The main things you have to worry about are avoiding getting killed in combat and getting enough to eat. Enemies (shown as various color letters and symbols) can be fled from or killed. To attack something, run into it. To attack something at range, fling things at it. Various items that you find or make can help in various ways. Some things that you find will be edible, some things you kill will provide edible corpses, and you can grow food as well.');

        y += 1 + display.drawText(1, y++, baseColor+'What you can carry is limited by mass and bulk. Carrying extra mass slows you, eventually completely. Bulk is a hard limit...with some exceptions. Anything held in your hands or worn on your body does not count towards your bulk limit. Also, containers (e.g. backpacks, etc.) count their own bulk, but NOT the bulk of anything stored in them.');

        y += 1 + display.drawText(1, y++, baseColor+'Impassable spaces are shown as various colored #\'s. You can dig at them by running into them. Digging takes quite a while, but lets you make your own passages, and occasionally you find useful things. With the right supplies and skills you can also build structures of various sorts.');

//        y += display.drawText(1, y++, baseColor+'');

        y = Game.getScreenHeight()-1;
        text = '%c{yellow}--- press space key to continue ---';
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
    },
    setParentScreen: function(screen) {
        this._parentScreen = screen;
    },
    handleInput: function(inputType, inputData) {
        if (inputData.keyCode === ROT.VK_SPACE) {
            if (Game.getGameStage()=='starting') {
                // NOTE: this brief timeout gives time for the input to clear (so the next screen isn't skipped over)
                setTimeout(function(){
                    Game.Screen.playScreen.setSubScreen(Game.Screen.storyScreen);
                },40);
            } else {
                Game.Screen.playScreen.setSubScreen(null);
            }
        }
        
    },
    getHelpSections: function() {
        return ['movement','levels','worldinteraction','inventory','sense','meta'];
    }
};


////////////////////////////////////////////////////////////

Game.Screen.storyScreen = {
    texts: {
        'was_starting':"You are a part of one of the first human exploration crews on Mars. After years of training, extensive technical preparation, and months of confined travel aboard the ship you finally made it to Mars! With your 6 day acclimation period done you now get to head out on the Martian surface for the first time. Your team has been sent to check out an interesting looking crater on the lower slopes of nearby Elysium Mons.",
        'was_starting2':"It takes a while to get to the survey site, but that gives you and your team time to double check your gear. The HEM Suits are all in good shape, and everyone seems to be as excited as you are. The last half-kilometer or so is too rough for the rover, so you pile out and make the rest of the trek on foot. While others eagerly explore around, you take a moment to pause near the center of the crater and just take it all in. It is truly amazing! ...but something somehow seems a little bit 'off' here...",
        'was_surface':"*RUMBLE* Quake! Someone... Dari?... drops out of sight, and almost immediately also out of radio contact. While trying to ignore the screaming over the radio you rush for stable-looking ground. Out of the corner of your eye you see several more of your teammates are swallowed up by the ground. Suddenly some kind of sinkhole opens under your feet! You plunge beneath the surface! The last things you remember are the radio-relayed panic of your team mates as you fall out of sight, the sky vanishing as the edges of the hole fall in after you, a terrific THUMP as you bounce off something on your way down, then blackness....",
        'was_falling':"You awake to discover, to your shock, that you are not dead. Your gear was badly damaged by the fall - there's no way you'll be calling for help with that mess, and your suit integrity is completely shot. About the only thing still working is an emergency light on your helmet, a hand-held analyzer, and your old-fashioned multi-tool. On the plus side, you've made an amazing discovery! The cave air down here is actually breathable (at least for the short term), the temperature is warm enough that the crushed heating unit won't be what does you in, and through your slightly bloodied and swollen nose you think that you detect a faint, strangely organic aroma! Now all you have to do is figure out how to let your team know that you survived, and- Wait a moment! Is that *movement* over there in the shadows....!?",
        'was_uppercaves':'After a harrowing descent you find yourself in a very large cave and dealing with a very foul smell.'
    },
    enter: function() {
        Game.AuxScreen.helpScreen.refresh(this.getHelpSections());
    },
    render: function(display) {
        var text = 'CAVES of MARS';
        var border = '-------------';
        var y = 0;
        y += 3;
        display.drawText(1, y++, this.texts['was_'+Game.getGameStage()]);
        y = Game.getScreenHeight()-1;
        text = '%c{yellow}--- press space key to continue ---';
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
        Game.AuxScreen.helpScreen.refresh(this.getHelpSections());
    },
    getHelpSections: function() {
        return [];
    },
    setParentScreen: function(screen) {
        this._parentScreen = screen;
    },
    handleInput: function(inputType, inputData) {
        if (inputData.keyCode === ROT.VK_SPACE) {
            if (Game.getGameStage()=='starting') {
                setTimeout(function(){
                    Game.setGameStage('starting2');
                    Game.refresh();
                },40);
                return;
            }
            else if (Game.getGameStage()=='starting2') {
                Game.setGameStage('surface');
                var player = Game.Screen.playScreen.getPlayer();
                player.switchMap(new Game.Map.Surface());
                var map = player.getMap();
                Game.Screen.playScreen.getPlayer().setPosition(map.getWidth()/2 + Game.util.getRandomInteger(-3,3),map.getHeight()/2 + Game.util.getRandomInteger(-3,3),0);
                Game.Screen.playScreen.setSubScreen(null);
                return;
            }
            else if (Game.getGameStage()=='surface') {

                // give the player just a damaged suit
                var player = Game.Screen.playScreen.getPlayer();
                player.clearInventory();
                

                setTimeout(function(){
                    Game.refresh();
                    Game.setGameStage('falling');
                    Game.switchScreen(Game.Screen.fallingScreen);
                    },100);
                return;
            }
            else if (Game.getGameStage()=='falling') {
                Game.setGameStage('uppercaves');
                var player = Game.Screen.playScreen.getPlayer()


                player.switchMap(new Game.Map.Cave());


                // give the player just a damaged suit
                var h = Game.ItemRepository.create('HEM suit, damaged');
                //player.addItem(h);
                player.wear(h);
                
                var itemTesting = false;
                /////////////////////////////
                /// CODE FOR ITEM TESTING!!!!
                if (itemTesting) {
                    console.log('item testing code is active');
                
//                player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('human corpse'),player.getX(),player.getY(),player.getZ());
                player.addItem(Game.ItemRepository.create('sack'));
                player.addItem(Game.ItemRepository.create('shoulder-strap'));
                player.addItem(Game.ItemRepository.create('shoulder-strap'));
                player.addItem(Game.ItemRepository.create('bandolier'));
                player.addItem(Game.ItemRepository.create('stone shot'));
                player.addItem(Game.ItemRepository.create('stone shot'));
                player.addItem(Game.ItemRepository.create('iron shot'));
                player.addItem(Game.ItemRepository.create('iron shot'));

                for (var i=0;i<6;i++) {
                    player.addItem(Game.ItemRepository.createRandom());
                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('lodestone'),player.getX(),player.getY(),player.getZ());
                }
                
                for (var i=0;i<24;i++) {
                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.createRandom(),player.getX(),player.getY(),player.getZ());
//                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('human corpse'),player.getX(),player.getY(),player.getZ());
//                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('geodic nut'),player.getX(),player.getY(),player.getZ());
//                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('geodic nut'),player.getX(),player.getY(),player.getZ());
//                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('spore-y mass'),player.getX(),player.getY(),player.getZ());
//                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('lodestone'),player.getX(),player.getY(),player.getZ());
                }
/*
                  player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('plated leather armor'),player.getX(),player.getY(),player.getZ());

                */
                }
                /// CODE FOR ITEM TESTING!!!!
                /////////////////////////////

                var entityTesting = false;
                /////////////////////////////
                /// CODE FOR ENTITY TESTING!!!!
                if (entityTesting) {
                    console.log('entity testing code is active');
                
//                player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('human corpse'),player.getX(),player.getY(),player.getZ());
//                player.addItem(Game.ItemRepository.create('sling'));
//                player.addItem(Game.ItemRepository.create('stone shot'));
//                player.addItem(Game.ItemRepository.create('stone shot'));
//                player.addItem(Game.ItemRepository.create('iron shot'));
//                player.addItem(Game.ItemRepository.create('iron shot'));

//                for (var i=0;i<1;i++) {
                    var bb = Game.EntityRepository.create('angry-bug');
                    bb.setPosition(player.getX()+2,player.getY()+2,0);
                    player.getMap().addEntity(bb);
                    Game.BB = bb;
//                    player.getMap().addEntityAtRandomPosition(bb,0);
                    
                    //console.dir(Game.ALL_THINGS[bb.getKey()]);
//                }
                
//                for (var i=0;i<6;i++) {
//                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('human corpse'),player.getX(),player.getY(),player.getZ());
//                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('spore-y mass'),player.getX(),player.getY(),player.getZ());
//                    player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('lodestone'),player.getX(),player.getY(),player.getZ());
//                }
/*
                  player.getMap().attemptAddItemAtOrAdjacentTo(Game.ItemRepository.create('plated leather armor'),player.getX(),player.getY(),player.getZ());

                */
                }
                /// CODE FOR ENTITY TESTING!!!!
                /////////////////////////////


                // place the damaged tool
                var map = player.getMap();
                var px = player.getX();
                var py = player.getY();
                map.addItem(px,py,0,Game.ItemRepository.create('JAT tool, damaged'));

                // scatter rocks around
                if (! itemTesting || true) {
                    var adjCoords = Game.util.coordsNeighboring(px,py);
                    for (var i=0;i<adjCoords.length;i++) {
                        if (map.getTile(adjCoords[i].x, adjCoords[i].y, 0) == Game.Tile.floorTile) {
                            map.addItem(adjCoords[i].x, adjCoords[i].y,0,Game.ItemRepository.create('rock'));
                            if (ROT.RNG.getUniform() < .35) {
                                map.addItem(adjCoords[i].x, adjCoords[i].y,0,Game.ItemRepository.create('powerbar'));
                            }
                        }

                        var adjCoords2 = Game.util.coordsNeighboring(adjCoords[i].x, adjCoords[i].y);
                        for (var j=0;j<adjCoords2.length;j++) {
                            var addX = adjCoords2[j].x;
                            var addY = adjCoords2[j].y;
                            
                            if ((ROT.RNG.getUniform() < .5) && (addX!=px) && (addY!=py) && (map.getTile(addX, addY, 0) == Game.Tile.floorTile)) {
                                map.addItem(addX, addY, 0,Game.ItemRepository.create('rock'));
                            }

                            if (ROT.RNG.getUniform() < .05) {
                                if (map.getTile(addX, addY, 0) == Game.Tile.floorTile) {
                                    map.addItem(addX, addY, 0,Game.ItemRepository.create('powerbar'));
                                } else {
                                    map.addItem(px, py, 0,Game.ItemRepository.create('powerbar'));
                                }
                            }
                            
                        }
                    }
                    
                    
                }
                /*
                // falling from that height *HURTS*
                var fallingDamage = Math.floor(player.getMaxHp()*(.3+ROT.RNG.getUniform()/2)) + 30;
                player.takeDamage(player,fallingDamage);
                Game.sendMessage(player,'That was a long way down with a hard surface waiting at the bottom. Luckily there were some pointy rocks to cushion your fall...');
                Game.sendMessage(player,'You take %d damage',[fallingDamage],'%b{#422}');
                if (!player.isAlive()) {
                    Game.AuxScreen.messageScreen.refresh();
                    Game.Screen.playScreen.setGameEnded(true);
                    Game.switchScreen(Game.Screen.loseScreen);
                    return;
                }
                */
                Game.Screen.playScreen.setSubScreen(null);

//                setTimeout(function() {
//                    Game.sendMessage(Game.Screen.playScreen.getPlayer(),"OW! You awake battered and bruised, surrounded by fallen rocks, and lying on something distinctly uncomfortable.");
//                    Game.sendMessage(Game.Screen.playScreen.getPlayer(),"Through some combination of luck and quality nano-docs you're at least still alive...");
//                    Game.refresh();
//                },50);
                
                Game.AuxScreen.infoScreen.setCurrentShortInfo("OW! You awake battered and bruised, surrounded by fallen rocks, and lying on something distinctly uncomfortable.");
                Game.AuxScreen.infoScreen.setCurrentDetailInfo("Through some combination of luck and quality nano-docs you're at least still alive...");

                //Game.AuxScreen.avatarScreen.render();
                Game.refresh();

                return;
            }
            else if (Game.getGameStage()=='uppercaves') {
                Game.setGameStage('bossfight1');
                Game.AuxScreen.infoScreen.setCurrentShortInfo("You think you hear a voice! In your haste to get down you fail to adequately test a foot hold. You slip and fall, tumbling past several openings...");
                Game.AuxScreen.infoScreen.setCurrentDetailInfo("...and manage a pretty clean landing after a scary amount freefall - thank goodness for the reduced gravity! However, there's no way you'll be able to make it back up that way. Looking around you seem to be in a large, open cavern, and there's actual standing water down here! Also, less encouragingly, there's the noise of something quite large moving around....");
                Game.Screen.playScreen.getPlayer().switchMap(new Game.Map.BossCavern());
                Game.Screen.playScreen.setSubScreen(null);
                Game.refresh();
                return;
            }
            
        }
        
    }
};

////////////////////////////////////////////////////////////

Game.Screen.fallingScreen = {
    y: 1,
    _player: null,
    getHelpSections: function() {
        return [];
    },
    enter: function() {
        console.log("Entered falling screen."); 
        this._player = Game.getPlayer();
        this._fallLine = '';
        for (var i=0;i<Game.getScreenWidth();i++) {
            if (i == Math.floor(Game.getScreenWidth() / 2)) {
                this._fallLine += Game.Tile.airTile.getRepresentation();
            } else {
                this._fallLine += Game.Tile.STANDARD_WALL_TILES.random().getRepresentation();
            }
        }
        
        
        
        setTimeout(this.fallFarther,300);
        Game.AuxScreen.helpScreen.refresh(this.getHelpSections());
    },
    exit: function() {
        console.log("Exited falling screen.");
    },
    render: function(display) {
        var wallRep = Game.Tile.STANDARD_WALL_TILES.random().getRepresentation();
        if (this.y <=2) {
            display.drawText(0,2,this._fallLine);
        } else if (this.y==3) {
            display.drawText(0,1,this._fallLine);
        }
        display.drawText(Game.getScreenWidth() / 2,this.y,this._player.getRepresentation());
//        this._player.getMap().getEngine().lock();
    },
    getY: function() {
        return this.y;
    },
    setY: function(newY) {
        this.y = newY;
    },
    fallFarther: function() {
        var y = Game.Screen.fallingScreen.getY();
        Game.Screen.fallingScreen.setY(y+1);
        Game.refresh();
        if (y < Game.getScreenHeight()) {
            var newTimeout = Math.max(30,200/(y*y*.5));
            
            setTimeout(Game.Screen.fallingScreen.fallFarther,newTimeout);
        } else {
            setTimeout(Game.Screen.fallingScreen.finishFall,1250);
        }
    },
    finishFall: function() {
        if (! Game.Screen.finishedInitialFall) {
            Game.Screen.finishedInitialFall = true;
            
            while (Game.getPlayer().hasArchivedMessages()) {
                Game.getPlayer().clearMessages();
            }
        
            // falling from that height *HURTS*
            var player = Game.getPlayer();
            var fallingDamage = Math.floor(player.getMaxHp()*(.3+ROT.RNG.getUniform()/2));
            player.takeDamage(player,fallingDamage);
            Game.sendMessage(player,'That was a long way down with a hard surface waiting at the bottom. Luckily there were some pointy rocks to cushion your fall...');
            Game.sendMessage(player,'You take %d damage',[fallingDamage],'%b{#422}');
            if (!player.isAlive()) {
                player.switchMap(new Game.Map.Cave());
                Game.AuxScreen.messageScreen.refresh();
                Game.Screen.playScreen.setGameEnded(true);
                Game.Screen.playScreen.setSubScreen(null);
                Game.switchScreen(Game.Screen.playScreen);
                return;
            }
            Game.Screen.playScreen.setSubScreen(Game.Screen.storyScreen);
            Game.switchScreen(Game.Screen.playScreen);        
        }
        
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}

Game.Screen.finishedInitialFall = false;

////////////////////////////////////////////////////////////

// Define our winning screen
Game.Screen.winScreen = {
    _texts: [
        "Wonder of wonders, the comm unit in the remains of Micah's HEM suit is still functional! You strip the battery out of his broken headlamp, out of your analyzer, and after a bit of thought out of your own head lamp as well. Stringing them together in series gives you enough juice to punch a signal through to the surface... you hope.",
        "After several days waiting the last of the power is gone and you're left in darkness... but not silence! You can faintly hear the sound of human voices! Lots of shouting eventually produces a response, and soon a rope descends, followed by... a monster? You've been through too much at this point to give up without a fight!",
        "....",
        "They manage to subdue you without killing you, though (thankfully) you have no memory of this. You awake back at the base in the autodock, surrounded by anxious friends and crew mates. They tell you that it was a very near thing. Your nano-docs did the best they could while down there, but there were strange interactions with some of the native life, The fungal hyphae that had laced your body were beginning to get in to your brain - just a day or so longer and you would have been totally lost. With great relief you dictate your full, harrowing tale to a rapt audience.",
        "The story of your experience becomes an immediate best-seller back on earth, and spurs a new age of exploration, not to mention migration. Years later you finally find some closure when you speak at the dedication ceremony of a statue that the Mars One city government is erecting in honor of the first explorers of humanity's second home. Farewell Micah, Dari, Ondras, Maya, and all the rest who gave their lives to this harsh place. Wherever you are, may you take what comfort you can in having helped bring about a new age of wonder...",
        "FINIT"
    ],
    _text_idx: 0,
    _inputLock: false,
    getHelpSections: function() {
        return ['winning'];
    },
    enter: function() {
        console.log("Entered win screen."); 
        Game.AuxScreen.helpScreen.refresh(this.getHelpSections());
    },
    exit: function() { console.log("Exited win screen."); },
    render: function(display) {
        // Render our prompt to the screen
        display.drawText(2,3,this._texts[this._text_idx]);
        if (this._text_idx < this._texts.length-1) {
            y = Game.getScreenHeight()-1;
            text = '%c{yellow}--- press space key to continue ---';
            display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
        } else {
            display.drawText(15,1,"%c{black}|%c{orange}                          .--------.");
            display.drawText(15,2,"%c{black}|%c{orange}                     .---'  o    .  `---.");
            display.drawText(15,3,"%c{black}|%c{orange}                  .-'    .    O#  .. . . `-.");
            display.drawText(15,4,"%c{black}|%c{orange}               .-'     ### ##  #.#         .`..");
            display.drawText(15,5,"%c{black}|%c{orange}             .'##   ###  ##       # ###   . . .`.");
            display.drawText(15,6,"%c{black}|%c{orange}           .'##O  #### ## ####.  #######   .    .`.");
            display.drawText(15,7,"%c{black}|%c{orange}          /###  o   ###O  #O### .##   ##     O   . \\");
            display.drawText(15,8,"%c{black}|%c{orange}         /      .  ###O## # ##....### ### ##     .  \\");
            display.drawText(15,9,"%c{black}|%c{orange}        /#  o  ..  ..  #O#  ## .####      # #     ## \\");
            display.drawText(15,10,"%c{black}|%c{orange}       /##O      .  .#####  o   ###### # ##  # o #### \\");
            display.drawText(15,11,"%c{black}|%c{orange}      /#O###           ...       #   ##########  ##### \\");
            display.drawText(15,12,"%c{black}|%c{orange}      |#  ## O  O #  `.-./  .     ### O ### ###   ###  |");
            display.drawText(15,13,"%c{black}|%c{orange}     / O#### O      --`## .        ##  ##O##   ###    . \\");
            display.drawText(15,14,"%c{black}|%c{orange}     |# ###O .  #  #    `    #              . ######    |");
            display.drawText(15,15,"%c{black}|%c{orange}     |   O#                   ##o  #    .     ## ###    |");
            display.drawText(15,16,"%c{black}|%c{orange}     |  .     #   # # .   . o        ##   o   ###   .   |");
            display.drawText(15,17,"%c{black}|%c{orange}     \\  O  #    #    .  #..  -. .   ## #       ##       /");
            display.drawText(15,18,"%c{black}|%c{orange}      |  #    # .#  ..     .  '   . ##O#     .    .    |");
            display.drawText(15,19,"%c{black}|%c{orange}      \\ .  o   ..  #  ####...##      ##  .           . /");
            display.drawText(15,20,"%c{black}|%c{orange}       \\      ###    # ####,  .          .   .. o     /");
            display.drawText(15,21,"%c{black}|%c{orange}        \\    #####   ##\\#####,   O        .....      /");
            display.drawText(15,22,"%c{black}|%c{orange}         \\ o  ###   .....##\\ __ #### .   ..... .--.  /");
            display.drawText(15,23,"%c{black}|%c{orange}          \\  ..  .     . \\.-###.    ###   . .`--'  /");
            display.drawText(15,24,"%c{black}|%c{orange}           `.             `-' #  #,    #  O        .'");

        }
    },
    handleInput: function(inputType, inputData) {
        if ((inputData.keyCode === ROT.VK_SPACE)&&(this._text_idx < this._texts.length-1)&&(!this._inputLock)) {
            this._inputLock=true;
            //console.dir(this);
            setTimeout(function(){
                Game.Screen.winScreen._text_idx++;
                Game.Screen.winScreen._inputLock = false;
                Game.refresh();
            },100);
        }
    }
}

// Define our losing screen
Game.Screen.loseScreen = {
    enter: function() {    console.log("Entered lose screen.");
        Game.AuxScreen.helpScreen.refresh(this.getHelpSections());
        Game.AuxScreen.infoScreen.setCurrentShortInfo('');
        Game.AuxScreen.infoScreen.setCurrentDetailInfo('');
        Game.AuxScreen.avatarScreen.refresh();
        Game.getPlayer().resetMessages();
        Game.AuxScreen.messageScreen.refresh();
    },
    exit: function() { console.log("Exited lose screen."); },
    getHelpSections: function() {
        return ['losing'];
    },
    render: function(display) {
        // Render our prompt to the screen
//        for (var i = 0; i < 22; i++) {
//            display.drawText(2, i + 1, "%b{red}You lose! :(");
//        }
        display.drawText(2, 2, "%c{black}|%c{grey}        darkness descends and all the noises stop");
        display.drawText(2,4,"%c{black}|%c{white}                                  ...");
        display.drawText(2,5,"%c{black}|%c{white}                                ;::::;");
        display.drawText(2,6,"%c{black}|%c{white}                              ;::::; :;");
        display.drawText(2,7,"%c{black}|%c{white}                            ;:::::'   :;");
        display.drawText(2,8,"%c{black}|%c{white}                           ;:::::;     ;.");
        display.drawText(2,9,"%c{black}|%c{white}                          ,:::::'       ;           OOO\\");
        display.drawText(2,10,"%c{black}|%c{white}                          ::::::;       ;          OOOOO\\");
        display.drawText(2,11,"%c{black}|%c{white}                          ;:::::;       ;         OOOOOOOO");
        display.drawText(2,12,"%c{black}|%c{white}                         ,;::::::;     ;'         / OOOOOOO");
        display.drawText(2,13,"%c{black}|%c{white}                       ;:::::::::`. ,,,;.        /  / *OOOOOO");
        display.drawText(2,14,"%c{black}|%c{white}                     .';:::::::::::::::::;,     /  /     *OOOO");
        display.drawText(2,15,"%c{black}|%c{white}                    ,::::::;::::::;;;;::::;,   /  /        *OOO");
        display.drawText(2,16,"%c{black}|%c{white}                   ;`::::::`'::::::;;;::::: ,#/  /          *OOO");
        display.drawText(2,17,"%c{black}|%c{white}                   :`:::::::`;::::::;;::: ;::#  /            *OOO");
        display.drawText(2,18,"%c{black}|%c{white}                   ::`:::::::`;:::::::: ;::::# /              *OO");
        display.drawText(2,19,"%c{black}|%c{white}                   `:`:::::::`;:::::: ;::::::#/               *OO");
        display.drawText(2,20,"%c{black}|%c{white}                    :::`:::::::`;; ;:::::::::##                OO");
        display.drawText(2,21,"%c{black}|%c{white}                    ::::`:::::::`;::::::::;:::#                OO");
        display.drawText(2,22,"%c{black}|%c{white}                    `:::::`::::::::::::;'`:;::#                O");
        display.drawText(2,23,"%c{black}|%c{white}                     `:::::`::::::::;' /  / `:#");
        display.drawText(2,24,"%c{black}|%c{white}                      ::::::`:::::;'  /  /   `#");

    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}