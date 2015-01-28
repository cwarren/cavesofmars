var Game =  {
    _display_avatar: null,
    _display_main: null,
    _display_help: null,
    _display_message: null,
    _display_info: null,
    _aux_screen_avatar: null,
    _currentScreen: null, // CSW NOTE: a some point refactor this to a stack of screens....?
    _screenWidth: 80,
    _screenHeight: 24,
    _randomSeed: 12,
    _game_stage: 'start',
    _controlScheme: '',
    _player: null,
    init: function() {
        // Any necessary initialization will go here.
        this._randomSeed = 5 + Math.floor(Math.random()*100000);
        this._randomSeed = 59499;
        console.log(this._randomSeed);
        
        ROT.RNG.setSeed(this._randomSeed);

        this._player = new Game.Entity(Game.PlayerTemplate);
        
        this._display_main    = new ROT.Display({width: this._screenWidth,                 height: this._screenHeight});
        
        this._aux_screen_avatar = Game.AuxScreen.avatarScreen;
        this._aux_screen_avatar.init(Math.floor(this._screenWidth*.25),this._screenHeight,this._player);
        
        this._aux_screen_help = Game.AuxScreen.helpScreen;
        this._aux_screen_help.init(Math.floor(this._screenWidth*.25),this._screenHeight);

        this._aux_screen_message = Game.AuxScreen.messageScreen;
        this._aux_screen_message.init(Math.floor(this._screenWidth*.75),Math.floor(this._screenHeight*.5),this._player);

        this._aux_screen_info = Game.AuxScreen.infoScreen;
        this._aux_screen_info.init(Math.floor(this._screenWidth*.75),Math.floor(this._screenHeight*.5));

        //this._display_avatar  = new ROT.Display({width: Math.floor(this._screenWidth*.25), height: this._screenHeight});
        //this._display_help    = new ROT.Display({width: Math.floor(this._screenWidth*.25), height: this._screenHeight});
        
        //this._display_message = new ROT.Display({width: Math.floor(this._screenWidth*.75), height: Math.floor(this._screenHeight*.5)});
        //this._display_info    = new ROT.Display({width: Math.floor(this._screenWidth*.75), height: Math.floor(this._screenHeight*.5)});

        
        
        // Create a helper function for binding to an event
        // and making it send it to the screen
        var game = this; // So that we don't lose this
        
        this.setGameStage('starting');
        this.setControlScheme(Game.Bindings.BindingSet_Numpad);
        
        var bindEventToScreen = function(event) {
            window.addEventListener(event, function(e) {
                // When an event is received, send it to the
                // screen if there is one
                if (game._currentScreen !== null) {
                    // Send the event type and data to the screen
                    game._currentScreen.handleInput(event, e);
                }
            });
        }
        // Bind keyboard input events
        bindEventToScreen('keydown');
//        bindEventToScreen('keyup');
        bindEventToScreen('keypress');
    },
    
    
    refresh: function() {
        // Clear the screen
        this._display_main.clear();
        // Render the screen
        this._currentScreen.render(this._display_main);
        if (this._currentScreen == Game.Screen.playScreen) {
            this._aux_screen_avatar.refresh();
            this._aux_screen_help.refresh();
            this._aux_screen_message.refresh();
            this._aux_screen_info.refresh();
        }
    },
    
    getPlayer: function() {
        return this._player;
    },
    
    getDisplayAvatar: function() {
        return this._aux_screen_avatar.getDisplay();
    },
    getDisplayMain: function() {
        return this._display_main;
    },
    getDisplayHelp: function() {
        return this._aux_screen_help.getDisplay();
    },
    getDisplayMessage: function() {
        return this._aux_screen_message.getDisplay();
    },
    getDisplayInfo: function() {
        return this._aux_screen_info.getDisplay();
    },


    getScreenWidth: function() {
        return this._screenWidth;
    },
    getScreenHeight: function() {
        return this._screenHeight;
    },
    getGameStage: function() {
        return this._game_stage;
    },
    setGameStage: function(newstage) {
        this._game_stage = newstage;
    },

    getControlScheme: function() {
        return this._controlScheme;
    },
    setControlScheme: function(newScheme) {
        this._controlScheme = newScheme;
        Game.AuxScreen.helpScreen.setForBinding(this._controlScheme);
    },
    
    switchScreen: function(screen) {
        // If we had a screen before, notify it that we exited
        if (this._currentScreen !== null) {
            this._currentScreen.exit();
        }
        // Clear the display
        this.getDisplayMain().clear();
        
        // Update our current screen, notify it we entered
        // and then render it
        this._currentScreen = screen;
        if (!this._currentScreen !== null) {
            this._currentScreen.enter();
            this.refresh();
        }
    }
}


window.onload = function() {
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize the game
        Game.init();
        
        // Add the containers to our HTML page

        document.getElementById('avatar-display-area').appendChild( Game.getDisplayAvatar().getContainer());
        document.getElementById('main-display-area').appendChild(   Game.getDisplayMain().getContainer());
        document.getElementById('help-display-area').appendChild(   Game.getDisplayHelp().getContainer());

        document.getElementById('message-display-area').appendChild(Game.getDisplayMessage().getContainer());
        document.getElementById('info-display-area').appendChild(   Game.getDisplayInfo().getContainer());
        
        // Load the start screen
        Game.switchScreen(Game.Screen.startScreen);
    }
}
