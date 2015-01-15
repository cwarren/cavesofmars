Game.Screen = {};

// CSW NOTE: consider adding a screen stack here (Game.Screen.ScreensStack = Array) - this would be used by the switch screen function to handle deeper structures than a simple current-screen-and-new-screen arrangement

Game.Screen.DEFAULT_COLOR_SETTER = '%c{white}%b{black}';

// Define our initial start screen
Game.Screen.startScreen = {
    enter: function() {    console.log("Entered start screen."); },
    exit: function() { console.log("Exited start screen."); },
    render: function(display) {
        // Render our prompt to the screen
        display.drawText(1,1, "%c{yellow}Javascript Roguelike");
        display.drawText(1,2, "Press [Enter] to start!");
    },
    handleInput: function(inputType, inputData) {
        // When [Enter] is pressed, go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.Screen.playScreen.setSubScreen(Game.Screen.helpScreen);
                Game.switchScreen(Game.Screen.playScreen);
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
    setSubScreen: function(subScreen) {
            this._subScreen = subScreen;
            if (subScreen) {
                subScreen.setParentScreen(this);
            }
            
            // Refresh screen on changing the subscreen
            Game.refresh();
    },
    enter: function() {
        
        // Create a map based on our size parameters
        var width = 128;
        var height = 48;
        var depth = 6;

//        width = 80;
//        height = 24;
//        depth = 1;

        // Create our map from the tiles and player
        this._player = new Game.Entity(Game.PlayerTemplate);
        var tiles = new Game.Builder(width, height, depth).getTiles();
        var map = new Game.Map.Cave(tiles, this._player);
        
        // Start the map's engine
        map.getEngine().start();
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
                if (map.isExplored(x, y, z)) {
                    // Fetch the glyph for the tile and render it to the screen
                    // at the offset position.
                    var glyph = map.getTile(x, y, z);
                    var foreground = glyph.getForeground();
                    // If we are at a cell that is in the field of vision, we need
                    // to check if there are items or entities.
                    if (visibleCells[x + ',' + y]) {
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
                        }
                        // Update the foreground color in case our glyph changed
                        foreground = glyph.getForeground();
                    } else {
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
    },
    renderPlayerStats: function(display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

        // Render stats et al
        
        // player HP, Atk, Def, Level, and Current Exp
        
        var stats = Game.Screen.DEFAULT_COLOR_SETTER;
        stats += vsprintf('HP: %d/%d  ', [this._player.getHp(), this._player.getMaxHp()]);
        stats += vsprintf('Atk: %d  ', [this._player.getAttackValue()]);
        stats += vsprintf('Def: %d  ', [this._player.getDefenseValue()]);
        stats += vsprintf('Lvl: %d (%d/%d)  ', [this._player.getLevel(),this._player.getExperience(), this._player.getNextLevelExperience()]);
        display.drawText(0, screenHeight, stats);

        // player hunger
        var hungerState = this._player.getHungerState();
        display.drawText(screenWidth*.7, screenHeight, hungerState);        

        // current level
        var curLevelText = Game.Screen.DEFAULT_COLOR_SETTER + vsprintf('Depth %d ', [this._player.getZ()+1]);
        display.drawText(screenWidth-12, screenHeight, curLevelText);
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
        this.renderPlayerMessages(display);
        this.renderPlayerStats(display);

        
    },
    handleInput: function(inputType, inputData) {
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

        var tookAction = false;
        if (inputType === 'keydown') {
            // inventory management/access
            if (inputData.keyCode === ROT.VK_I) {
                // Show the inventory screen
                this.showItemsSubScreen(Game.Screen.inventoryScreen, this._player.getItems(),'You are not carrying anything.');
                return;
            } else if (inputData.keyCode === ROT.VK_D) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.dropScreen, this._player.getItems(),'You have nothing to drop.');
                return;
            } else if (inputData.keyCode === ROT.VK_E && inputData.shiftKey) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.eatScreen, this._player.getItems(),'You have nothing to eat.');
                return;
            } else if (inputData.keyCode === ROT.VK_W) {
                if (inputData.shiftKey) {
                    // Show the wear screen
                    this.showItemsSubScreen(Game.Screen.wearScreen, this._player.getItems(),'You have nothing to wear.');
                } else {
                    // Show the wield screen
                    this.showItemsSubScreen(Game.Screen.wieldScreen, this._player.getItems(),'You have nothing to wield.');
                }
                return;
            } else if (inputData.keyCode === ROT.VK_X) {
                // Show the drop screen
                this.showItemsSubScreen(Game.Screen.examineScreen, this._player.getItems(),'You have nothing to examine.');
                return;
            } else if (inputData.keyCode === ROT.VK_G) {
                var items = this._player.getMap().getItemsAt(this._player.getX(), this._player.getY(), this._player.getZ());

                // If there is only one item, directly pick it up
                if (items && items.length === 1) { 
                    var item = items[0];
                    if (this._player.pickupItems([0])) {
                        Game.sendMessage(this._player, "You pick up %s.", [item.describeA()]);
                    } else {
                        Game.sendMessage(this._player, "Your inventory is full! Nothing was picked up.");
                    }
                    Game.refresh();
                } else {
                    this.showItemsSubScreen(Game.Screen.pickupScreen, items,'There is nothing here to pick up.');
                } 
            } else if (inputData.keyCode == ROT.VK_L) {
                // Setup the look screen.
                var offsets = this.getScreenOffsets();
                Game.Screen.lookScreen.setup(this._player,
                    this._player.getX(), this._player.getY(),
                    offsets.x, offsets.y);
                this.setSubScreen(Game.Screen.lookScreen);
                return;
            }


            // Movement (numpad based)
            if (inputData.keyCode === ROT.VK_NUMPAD5) { // rest/wait/do nothing
                tookAction = true;
            } else if (inputData.keyCode === ROT.VK_NUMPAD1) {
                tookAction = this.move(-1, 1, 0);
            } else if (inputData.keyCode === ROT.VK_NUMPAD2) {
                tookAction = this.move(0, 1, 0);
            } else if (inputData.keyCode === ROT.VK_NUMPAD3) {
                tookAction = this.move(1, 1, 0);
            } else if (inputData.keyCode === ROT.VK_NUMPAD4) {
                tookAction = this.move(-1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_NUMPAD6) {
                tookAction = this.move(1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_NUMPAD7) {
                tookAction = this.move(-1, -1, 0);
            } else if (inputData.keyCode === ROT.VK_NUMPAD8) {
                tookAction = this.move(0, -1, 0);
            } else if (inputData.keyCode === ROT.VK_NUMPAD9) {
                tookAction = this.move(1, -1, 0);
            }

        } else if (inputType === 'keypress') {
            var keyChar = String.fromCharCode(inputData.charCode);

            // stairs up or down
            if (keyChar === '>') {
                tookAction = this.move(0, 0, 1);
            } else if (keyChar === '<') {
                tookAction = this.move(0, 0, -1);
            } else if (keyChar === '?') {
                // Setup the help screen.
                this.setSubScreen(Game.Screen.helpScreen);
                return;
            }
        }  

        if (tookAction) {
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
};

Game.Screen.ItemListScreen.prototype.setParentScreen = function(screen) {
    this._parentScreen = screen;
}

Game.Screen.ItemListScreen.prototype.setup = function(player, items) {
    this._player = player;
    // Should be called before switching to the screen.
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
    // Clean set of selected indices
    this._selectedIndices = {};
    return count;
};

Game.Screen.ItemListScreen.prototype.render = function(display) {
    this._player.clearMessages();

    if (this._parentScreen) {
        this._parentScreen.renderTiles(display);
        this._parentScreen.renderPlayerStats(display);
    }

    var letters = 'abcdefghijklmnopqrstuvwxyz';
    // Render the caption in the top row
    display.drawText(0, 0, Game.Screen.DEFAULT_COLOR_SETTER + this._caption);
    var row = 0;
    if (this._hasNoItemOption) {
            display.drawText(0, 1, Game.Screen.DEFAULT_COLOR_SETTER + '0 - no item');
            row++;
    }
    for (var i = 0; i < this._items.length; i++) {
        // If we have an item, we want to render it.
        if (this._items[i]) {
            // Get the letter matching the item's index
            var letter = letters.substring(i, i + 1);
            
            // If we have selected an item, show a +, else show a dash between
            // the letter and the item's name.
            var selectionState = (this._canSelectItem && this._canSelectMultipleItems &&
                this._selectedIndices[i]) ? '+' : '-';
            
            // Check if the item is worn or wielded
            var suffix = '';
            if (this._items[i] === this._player.getArmor()) {
                suffix = ' (wearing)';
            } else if (this._items[i] === this._player.getWeapon()) {
                suffix = ' (wielding)';
            }

            // Render at the correct row and add 1
            var item_symbol = this._items[i].getColorDesignator()+this._items[i].getChar()+Game.Screen.DEFAULT_COLOR_SETTER;
            display.drawText(0, 1 + row, Game.Screen.DEFAULT_COLOR_SETTER + letter + ' ' + selectionState + ' ' + item_symbol + ' ' +this._items[i].describe() + suffix);
            row++;
        }
    }
};

Game.Screen.ItemListScreen.prototype.executeOkFunction = function() {
    // Gather the selected items.
    var selectedItems = {};
    for (var key in this._selectedIndices) {
        selectedItems[key] = this._items[key];
    }
    // Switch back to the play screen.
    Game.Screen.playScreen.setSubScreen(undefined);
    // Call the OK function and end the player's turn if it return true.
    if (this._okFunction(selectedItems)) {
        this._player.finishAction();
    }
};

Game.Screen.ItemListScreen.prototype.handleInput = function(inputType, inputData) {
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
            if (this._items[index]) {
                // If multiple selection is allowed, toggle the selection status, else
                // select the item and exit the screen
                if (this._canSelectMultipleItems) {
                    if (this._selectedIndices[index]) {
                        delete this._selectedIndices[index];
                    } else {
                        this._selectedIndices[index] = true;
                    }
                    // Redraw screen
                    Game.refresh();
                } else {
                    this._selectedIndices[index] = true;
                    this.executeOkFunction();
                }
            }
        }
    }
};

//-------------------

Game.Screen.inventoryScreen = new Game.Screen.ItemListScreen({
    caption: 'Inventory',
    canSelect: false
});

//-------------------

Game.Screen.pickupScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the items you wish to pickup',
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

//-------------------

Game.Screen.dropScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to drop',
    canSelect: true,
    canSelectMultipleItems: false,
    ok: function(selectedItems) {
        // Drop the selected item
        this._player.dropItem(Object.keys(selectedItems)[0]);
        return true;
    }
});

//-------------------

Game.Screen.eatScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to eat',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return item && item.hasMixin('Edible');
    },
    ok: function(selectedItems) {
        // Eat the item, removing it if there are no consumptions remaining.
        var key = Object.keys(selectedItems)[0];
        var item = selectedItems[key];
        Game.sendMessage(this._player, "You eat %s.", [item.describeThe()]);
        item.eat(this._player);
        if (!item.hasRemainingConsumptions()) {
            this._player.removeItem(key);
        }
        return true;
    }
});

//-------------------

Game.Screen.wieldScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasMixin('Equippable') && item.isWieldable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.unwield();
            Game.sendMessage(this._player, "You are empty handed.")
        } else {
            // Make sure to unequip the item first in case it is the armor.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wield(item);
            Game.sendMessage(this._player, "You are wielding %s.", [item.describeA()]);
            console.dir(this._player);
        }
        return true;
    }
});

//-------------------

Game.Screen.wearScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wear',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item) {
        return item && item.hasMixin('Equippable') && item.isWearable();
    },
    ok: function(selectedItems) {
        // Check if we selected 'no item'
        var keys = Object.keys(selectedItems);
        if (keys.length === 0) {
            this._player.unwield();
            Game.sendMessage(this._player, "You are not wearing anthing.")
        } else {
            // Make sure to unequip the item first in case it is the weapon.
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wear(item);
            Game.sendMessage(this._player, "You are wearing %s.", [item.describeA()]);
        }
        return true;
    }
});

//-------------------

Game.Screen.examineScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to examine',
    canSelect: true,
    canSelectMultipleItems: false,
    isAcceptable: function(item) {
        return true;
    },
    ok: function(selectedItems) {
        var keys = Object.keys(selectedItems);
        if (keys.length > 0) {
            var item = selectedItems[keys[0]];
//            Game.sendMessage(this._player, "It's %s.", 
//                [
//                    //item.describeA(false),
//                    item.details()
//                ]);
            Game.sendMessage(this._player, item.details());
        }
        return true;
    }
});

////////////////////////////////////////////////////////////

Game.Screen.gainStatScreen = {
    _subScreen: null,
    _parentScreen: null,
    setup: function(entity) {
        // Must be called before rendering.
        this._entity = entity;
        this._options = entity.getStatOptions();
    },
    setParentScreen: function(screen) {
        this._parentScreen = screen;
    },
    render: function(display) {
        if (this._parentScreen) {
            this._parentScreen.renderTiles(display);
            this._parentScreen.renderPlayerMessages(display);
            this._parentScreen.renderPlayerStats(display);
        }
        
        if (this._entity.hasMixin('MessageRecipient')) {
            if (this._entity.hasAnyMessages()) {
                var localEntity = this._entity;
                setTimeout(function(){
                    localEntity.clearMessages();
                    Game.refresh();
                }, 1000);
            }
        }
        
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        display.drawText(0, 0, 'Choose a stat to increase: ');

        // Iterate through each of our options
        for (var i = 0; i < this._options.length; i++) {
            display.drawText(0, 2 + i, 
                letters.substring(i, i + 1) + ' - ' + this._options[i][0]);
        }

        // Render remaining stat points
        display.drawText(0, 4 + this._options.length,
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
    this._isAcceptableFunction = template['okFunction'] || function(x, y) {
        return false;
    };
    // The defaut caption function simply returns an empty string.
    this._captionFunction = template['captionFunction'] || function(x, y) {
        return '';
    }
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
};

Game.Screen.TargetBasedScreen.prototype.render = function(display) {
    Game.Screen.playScreen.renderTiles.call(Game.Screen.playScreen, display);

//    // Draw a line from the start to the cursor.
//    var points = Game.Geometry.getLine(this._startX, this._startY, this._cursorX,
//        this._cursorY);

    // Draw a line from the cursor to the start.
    var points = Game.Geometry.getLine(this._cursorX,this._cursorY,this._startX, this._startY);


    display.drawText(points[0].x, points[0].y, '%c{yellow}*');

    // Render stars along the line. (stop before the last node - don't cover up the player!)
    for (var i = 1, l = points.length-1; i < l; i++) {
        display.drawText(points[i].x, points[i].y, '%c{magenta}*');
    }

    // Render the caption at the bottom.
    display.drawText(0, Game.getScreenHeight() - 1, 
        this._captionFunction(this._cursorX + this._offsetX, this._cursorY + this._offsetY));
};

Game.Screen.TargetBasedScreen.prototype.handleInput = function(inputType, inputData) {
    // Move the cursor
    if (inputType == 'keydown') {
        if (inputData.keyCode === ROT.VK_NUMPAD1) {
            tookAction = this.moveCursor(-1, 1);
        } else if (inputData.keyCode === ROT.VK_NUMPAD2) {
            tookAction = this.moveCursor(0, 1);
        } else if (inputData.keyCode === ROT.VK_NUMPAD3) {
            tookAction = this.moveCursor(1, 1);
        } else if (inputData.keyCode === ROT.VK_NUMPAD4) {
            tookAction = this.moveCursor(-1, 0);
        } else if (inputData.keyCode === ROT.VK_NUMPAD6) {
            tookAction = this.moveCursor(1, 0);
        } else if (inputData.keyCode === ROT.VK_NUMPAD7) {
            tookAction = this.moveCursor(-1, -1);
        } else if (inputData.keyCode === ROT.VK_NUMPAD8) {
            tookAction = this.moveCursor(0, -1);
        } else if (inputData.keyCode === ROT.VK_NUMPAD9) {
            tookAction = this.moveCursor(1, -1);
        } else if (inputData.keyCode === ROT.VK_ESCAPE) {
            this._parentScreen.setSubScreen(undefined);
            this.setParentScreen(undefined);
            //Game.Screen.playScreen.setSubScreen(undefined);
        } else if (inputData.keyCode === ROT.VK_RETURN) {
            this.executeOkFunction();
        }
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
    this._parentScreen.setSubScreen(undefined);
    this.setParentScreen(undefined);
    
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
        
        // If the tile is explored, we can give a better capton
        if (map.isExplored(x, y, z)) {
            // If the tile isn't explored, we have to check if we can actually 
            // see it before testing if there's an entity or item.
            if (this._visibleCells[x + ',' + y]) {
                var items = map.getItemsAt(x, y, z);
                // If we have items, we want to render the top most item
                if (items) {
                    var item = items[items.length - 1];
                    return String.format('%s - %s (%s)',
                        item.getRepresentation(),
                        item.describeA(true),
                        item.details());
                // Else check if there's an entity
                } else if (map.getEntityAt(x, y, z)) {
                    var entity = map.getEntityAt(x, y, z);
                    return String.format('%s - %s (%s)',
                        entity.getRepresentation(),
                        entity.describeA(true),
                        entity.details());
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
    }
});

////////////////////////////////////////////////////////////

// CSW TODO - put key bindings in a separate file to that they can be referenced here
// Define our help screen
Game.Screen.helpScreen = {
    render: function(display) {
        var text = 'rogue1 help';
        var border = '-------------';
        var y = 0;
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, border);
        display.drawText(0, y++, 'The villagers have been complaining of a terrible stench coming from the cave.');
        display.drawText(0, y++, 'Find the source of this smell and get rid of it!');
        y += 3;
        display.drawText(0, y++, 'number pad for movement, run into something to hit it');
        display.drawText(0, y++, '[<],[>] up a level and down a level respectively');
        display.drawText(0, y++, '[g] to pick up something');
        display.drawText(0, y++, '[d] to drop something');
        display.drawText(0, y++, '[E] to eat something');
        display.drawText(0, y++, '[w] to wield items');
        display.drawText(0, y++, '[W] to wear items');
        display.drawText(0, y++, '[x] to examine carried items');
        display.drawText(0, y++, '[l] (lowercase L) to look around you');
        display.drawText(0, y++, '[?] to show this help screen');
        y += 3;
        text = '--- press space key to continue ---';
        display.drawText(Game.getScreenWidth() / 2 - text.length / 2, y++, text);
    },
    setParentScreen: function(screen) {
        this._parentScreen = screen;
    },
    handleInput: function(inputType, inputData) {
        if (inputData.keyCode === ROT.VK_SPACE) {
            Game.Screen.playScreen.setSubScreen(null);
        }
        
    }
};



////////////////////////////////////////////////////////////

// Define our winning screen
Game.Screen.winScreen = {
    enter: function() {    console.log("Entered win screen."); },
    exit: function() { console.log("Exited win screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            // Generate random background colors
            var r = Math.round(ROT.RNG.getUniform() * 255);
            var g = Math.round(ROT.RNG.getUniform() * 255);
            var b = Math.round(ROT.RNG.getUniform() * 255);
            var background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}You win!");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}

// Define our winning screen
Game.Screen.loseScreen = {
    enter: function() {    console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}