var Game =  {
    _display: null,
    _currentScreen: null, // CSW NOTE: a some point refactor this to a stack of screens....?
    _screenWidth: 80,
    _screenHeight: 24,
    _randomSeed: 12,
    init: function() {
        // Any necessary initialization will go here.
        this._randomSeed = 5 + Math.floor(Math.random()*100000);
        console.log(this._randomSeed);
        
        ROT.RNG.setSeed(this._randomSeed);
        ROT.RNG.setSeed(30794);
        
        
        this._display = new ROT.Display({width: this._screenWidth, height: this._screenHeight+1});
        // Create a helper function for binding to an event
        // and making it send it to the screen
        var game = this; // So that we don't lose this
        var bindEventToScreen = function(event) {
            window.addEventListener(event, function(e) {
                // When an event is received, send it to the
                // screen if there is one
                if (game._currentScreen !== null) {
                    // Send the event type and data to the screen
                    game._currentScreen.handleInput(event, e);
//                    game._display.clear();
//                    game._currentScreen.render(game._display);
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
        this._display.clear();
        // Render the screen
        this._currentScreen.render(this._display);
    },
    getDisplay: function() {
        return this._display;
    },
    getScreenWidth: function() {
        return this._screenWidth;
    },
    getScreenHeight: function() {
        return this._screenHeight;
    },
    switchScreen: function(screen) {
        // If we had a screen before, notify it that we exited
        if (this._currentScreen !== null) {
            this._currentScreen.exit();
        }
        // Clear the display
        this.getDisplay().clear();
        
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
        // Add the container to our HTML page
//        document.body.appendChild(Game.getDisplay().getContainer());
        document.getElementById('main-display-area').appendChild(Game.getDisplay().getContainer());
        // Load the start screen
        Game.switchScreen(Game.Screen.startScreen);
    }
}
