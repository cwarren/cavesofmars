Game.Bindings = {
    getAction: function(inputType,inputData,bindingSet) {

        var bindingHash = {};
        var bindingKey = '';
        
        if (inputType === 'keydown') {
            bindingHash = bindingSet.isKeydown;
            if (inputData.shiftKey) {
                bindingHash = bindingHash.isShift;
            }
            bindingKey = inputData.keyCode;
        } else if (inputType === 'keypress') {
            bindingHash = bindingSet.isKeypress;
            bindingKey = String.fromCharCode(inputData.charCode);
        }
        
        return bindingHash[bindingKey];
    },
    
    Actions: {
        Moves: {
            MOVE_UL:     {id: 7, word:"move", descr:"move diagonally to the up and to the left"},
            MOVE_U:      {id: 8, word:"move", descr:"move up"},
            MOVE_UR:     {id: 9, word:"move", descr:"move diagonally to the up and to the right"},
            MOVE_L:      {id: 4, word:"move", descr:"move left"},
            MOVE_WAIT:   {id: 5, word:"move", descr:"wait a turn where you are"},
            MOVE_R:      {id: 6, word:"move", descr:"move right"},
            MOVE_DL:     {id: 1, word:"move", descr:"move diagonally to the down and to the left"},
            MOVE_D:      {id: 2, word:"move", descr:"move down"},
            MOVE_DR:     {id: 3, word:"move", descr:"move diagonally to the down and to the right"},
            MOVE_ASCEND:  {id: 100, word:"ascend", descr:"go up one level"},
            MOVE_DESCEND: {id: 101, word:"descend", descr:"go down one level"}
        },
        Inventory: {
            INVENTORY_LIST:    {id: 1, word:"inventory", descr: "see everything that you're carrying"},
            INVENTORY_GET:     {id: 2, word:"get",       descr: "pick something up"},
            INVENTORY_DROP:    {id: 3, word:"drop",      descr: "drop something"},
            INVENTORY_WEAR:    {id: 4, word:"wear",      descr: "use something as armor"},
            INVENTORY_WIELD:   {id: 5, word:"wield",     descr: "use something as a weapon"},
            INVENTORY_EXAMINE: {id: 6, word:"examine",   descr: "get detailed information about something in your inventory"},
            INVENTORY_EAT:     {id: 7, word:"eat",       descr: "consume something that has food value"},
            INVENTORY_FLING:   {id: 8, word:"fling",     descr: "fire something from an appropriate missile weapon, or else throw it"},
        },
        World: {
            LOOK:   {id: 1, word:"look", descr: "get information about some visible space, item, or creature"}
        },
        Meta: {
            SWITCH_KEYBINDING: {id: 1, word:"controls", descr: "swap between numpad-oriented and laptop-oriented controls"},
            HELP:              {id: 2, word:"help",     descr: "show the help screen"}
        }        
    }
};

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

///////////////////////////
// Numpad-oriented bindings
Game.Bindings['BindingSet_Numpad'] = {};
Game.Bindings['BindingSet_Numpad']['NAME'] = 'Numpad-oriented controls';
Game.Bindings['BindingSet_Numpad']['isKeydown'] = {};
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD7] = Game.Bindings.Actions.Moves.MOVE_UL;
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD8] = Game.Bindings.Actions.Moves.MOVE_U,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD9] = Game.Bindings.Actions.Moves.MOVE_UR,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD4] = Game.Bindings.Actions.Moves.MOVE_L,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD5] = Game.Bindings.Actions.Moves.MOVE_WAIT,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD6] = Game.Bindings.Actions.Moves.MOVE_R,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD1] = Game.Bindings.Actions.Moves.MOVE_DL,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD2] = Game.Bindings.Actions.Moves.MOVE_D,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD3] = Game.Bindings.Actions.Moves.MOVE_DR,

Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_I] = Game.Bindings.Actions.Inventory.INVENTORY_LIST,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_D] = Game.Bindings.Actions.Inventory.INVENTORY_DROP,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_W] = Game.Bindings.Actions.Inventory.INVENTORY_WIELD,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_X] = Game.Bindings.Actions.Inventory.INVENTORY_EXAMINE,
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_G] = Game.Bindings.Actions.Inventory.INVENTORY_GET,

Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_L] = Game.Bindings.Actions.World.LOOK,

Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_BACK_SLASH] = Game.Bindings.Actions.Meta.SWITCH_KEYBINDING,

Game.Bindings['BindingSet_Numpad']['isKeydown']['isShift'] = {}
Game.Bindings['BindingSet_Numpad']['isKeydown']['isShift'][ROT.VK_E] = Game.Bindings.Actions.Inventory.INVENTORY_EAT,
Game.Bindings['BindingSet_Numpad']['isKeydown']['isShift'][ROT.VK_W] = Game.Bindings.Actions.Inventory.INVENTORY_WEAR

Game.Bindings['BindingSet_Numpad']['isKeypress'] = {};
Game.Bindings['BindingSet_Numpad']['isKeypress']['<'] = Game.Bindings.Actions.Moves.MOVE_ASCEND,
Game.Bindings['BindingSet_Numpad']['isKeypress']['>'] = Game.Bindings.Actions.Moves.MOVE_DESCEND,
Game.Bindings['BindingSet_Numpad']['isKeypress']['?'] = Game.Bindings.Actions.Meta.HELP


///////////////////////////
// Laptop-oriented bindings
Game.Bindings['BindingSet_Laptop'] = {};
Game.Bindings['BindingSet_Laptop']['NAME'] = 'Laptop-oriented controls';
Game.Bindings['BindingSet_Laptop']['isKeydown'] = {};
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_Q] = Game.Bindings.Actions.Moves.MOVE_UL;
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_W] = Game.Bindings.Actions.Moves.MOVE_U,
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_E] = Game.Bindings.Actions.Moves.MOVE_UR,
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_A] = Game.Bindings.Actions.Moves.MOVE_L,
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_S] = Game.Bindings.Actions.Moves.MOVE_WAIT,
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_D] = Game.Bindings.Actions.Moves.MOVE_R,
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_Z] = Game.Bindings.Actions.Moves.MOVE_DL,
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_X] = Game.Bindings.Actions.Moves.MOVE_D,
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_C] = Game.Bindings.Actions.Moves.MOVE_DR,

Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_I] = Game.Bindings.Actions.Inventory.INVENTORY_LIST,
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_H] = Game.Bindings.Actions.Inventory.INVENTORY_WIELD,
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_G] = Game.Bindings.Actions.Inventory.INVENTORY_GET,

Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_L] = Game.Bindings.Actions.World.LOOK,

Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_BACK_SLASH] = Game.Bindings.Actions.Meta.SWITCH_KEYBINDING,

Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'] = {}
Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'][ROT.VK_D] = Game.Bindings.Actions.Inventory.INVENTORY_DROP,
Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'][ROT.VK_E] = Game.Bindings.Actions.Inventory.INVENTORY_EAT,
Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'][ROT.VK_H] = Game.Bindings.Actions.Inventory.INVENTORY_WEAR
Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'][ROT.VK_X] = Game.Bindings.Actions.Inventory.INVENTORY_EXAMINE,

Game.Bindings['BindingSet_Laptop']['isKeypress'] = {};
Game.Bindings['BindingSet_Laptop']['isKeypress']['<'] = Game.Bindings.Actions.Moves.MOVE_ASCEND,
Game.Bindings['BindingSet_Laptop']['isKeypress']['>'] = Game.Bindings.Actions.Moves.MOVE_DESCEND,
Game.Bindings['BindingSet_Laptop']['isKeypress']['?'] = Game.Bindings.Actions.Meta.HELP


