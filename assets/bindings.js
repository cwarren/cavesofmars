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
        
        if (bindingHash[bindingKey]) {
            return bindingHash[bindingKey][1];
        }
        return undefined;
    },
    getDisplayStringsForActions: function(bindingSet) {
        var reverseLookups = {};
        //console.dir(bindingSet);
        
        var hashToInspect = bindingSet['isKeydown'];
        for (var k in hashToInspect){
            if (hashToInspect.hasOwnProperty(k) && (k != 'isShift')) {
                //console.log(k + ' = ' + hashToInspect[k][0]);
                //console.dir(hashToInspect[k][1]);
                reverseLookups[hashToInspect[k][1].unique_id] = hashToInspect[k][0];
            }
        }
        
        hashToInspect = bindingSet['isKeydown']['isShift'];
        for (var k in hashToInspect){
            if (hashToInspect.hasOwnProperty(k)) {
                reverseLookups[hashToInspect[k][1].unique_id] = hashToInspect[k][0];
            }
        }

        var hashToInspect = bindingSet['isKeypress'];
        for (var k in hashToInspect){
            if (hashToInspect.hasOwnProperty(k)) {
                reverseLookups[hashToInspect[k][1].unique_id] = hashToInspect[k][0];
            }
        }
        
        return reverseLookups;
    },
    Actions: {
        Moves: {
            MOVE_UL:     {id: 7, unique_id: Game.util.generateRandomString(24), word:"move", descr:"move diagonally to the up and to the left"},
            MOVE_U:      {id: 8, unique_id: Game.util.generateRandomString(24), word:"move", descr:"move up"},
            MOVE_UR:     {id: 9, unique_id: Game.util.generateRandomString(24), word:"move", descr:"move diagonally to the up and to the right"},
            MOVE_L:      {id: 4, unique_id: Game.util.generateRandomString(24), word:"move", descr:"move left"},
            MOVE_WAIT:   {id: 5, unique_id: Game.util.generateRandomString(24), word:"move", descr:"wait a turn where you are"},
            MOVE_R:      {id: 6, unique_id: Game.util.generateRandomString(24), word:"move", descr:"move right"},
            MOVE_DL:     {id: 1, unique_id: Game.util.generateRandomString(24), word:"move", descr:"move diagonally to the down and to the left"},
            MOVE_D:      {id: 2, unique_id: Game.util.generateRandomString(24), word:"move", descr:"move down"},
            MOVE_DR:     {id: 3, unique_id: Game.util.generateRandomString(24), word:"move", descr:"move diagonally to the down and to the right"},
            MOVE_ASCEND:  {id: 100, unique_id: Game.util.generateRandomString(24), word:"ascend", descr:"go up one level"},
            MOVE_DESCEND: {id: 101, unique_id: Game.util.generateRandomString(24), word:"descend", descr:"go down one level"}
        },
        Inventory: {
            INVENTORY_LIST:    {id: 1, unique_id: Game.util.generateRandomString(24), word:"inventory", descr: "see everything that you're carrying"},
            INVENTORY_GET:     {id: 2, unique_id: Game.util.generateRandomString(24), word:"get",       descr: "pick something up"},
            INVENTORY_DROP:    {id: 3, unique_id: Game.util.generateRandomString(24), word:"drop",      descr: "drop something"},
            INVENTORY_WEAR:    {id: 4, unique_id: Game.util.generateRandomString(24), word:"wear",      descr: "use something as armor"},
            INVENTORY_WIELD:   {id: 5, unique_id: Game.util.generateRandomString(24), word:"wield",     descr: "use something as a weapon"},
            INVENTORY_EXAMINE: {id: 6, unique_id: Game.util.generateRandomString(24), word:"examine",   descr: "get detailed information about something in your inventory"},
            INVENTORY_EAT:     {id: 7, unique_id: Game.util.generateRandomString(24), word:"eat",       descr: "consume something that has food value"},
            INVENTORY_FLING:   {id: 8, unique_id: Game.util.generateRandomString(24), word:"fire/fling",descr: "fire something from an appropriate missile weapon, or else throw it"},
        },
        Targeting: {
            LOOK:             {id: 1, unique_id: Game.util.generateRandomString(24), word:"look around",  descr: "get information about some visible space, item, or creature"},
            USE_OLD_TARGET:   {id: 2, unique_id: Game.util.generateRandomString(24), word:"re-target",  descr: "set the target to the previous target used"},
            CLEAR_OLD_TARGET: {id: 3, unique_id: Game.util.generateRandomString(24), word:"no target", descr: "remove any old targeting, setting the cursor to the player location"}
        },
        Meta: {
            SWITCH_KEYBINDING: {id: 1, unique_id: Game.util.generateRandomString(24), word:"swap controls", descr: "swap between numpad-oriented and laptop-oriented controls"},
            HELP:              {id: 2, unique_id: Game.util.generateRandomString(24), word:"help",     descr: "show the help screen"}
        }        
    }
};

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// CSW NOTE: the bindings are below, as a nested hash for each binding set. This works well from a performance standpoint, but it's bug-prone from a maintenance and dev standpoint - there's no reverse checking to make sure that every action has a binding for eavery binding set. Consider ways to flip the relationship so the bindings are associated directly with the action, the ease of lookup by inputType and inputData is maintained, and there's no entry duplication required.

///////////////////////////
// Numpad-oriented bindings
Game.Bindings['BindingSet_Numpad'] = {};
Game.Bindings['BindingSet_Numpad']['NAME'] = 'Numpad';
Game.Bindings['BindingSet_Numpad']['isKeydown'] = {};
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD7] = ['7',Game.Bindings.Actions.Moves.MOVE_UL];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD8] = ['8',Game.Bindings.Actions.Moves.MOVE_U];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD9] = ['9',Game.Bindings.Actions.Moves.MOVE_UR];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD4] = ['4',Game.Bindings.Actions.Moves.MOVE_L];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD5] = ['5',Game.Bindings.Actions.Moves.MOVE_WAIT];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD6] = ['6',Game.Bindings.Actions.Moves.MOVE_R];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD1] = ['1',Game.Bindings.Actions.Moves.MOVE_DL];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD2] = ['2',Game.Bindings.Actions.Moves.MOVE_D];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_NUMPAD3] = ['3',Game.Bindings.Actions.Moves.MOVE_DR];

Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_I] = ['i',Game.Bindings.Actions.Inventory.INVENTORY_LIST];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_D] = ['d',Game.Bindings.Actions.Inventory.INVENTORY_DROP];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_W] = ['w',Game.Bindings.Actions.Inventory.INVENTORY_WIELD];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_X] = ['x',Game.Bindings.Actions.Inventory.INVENTORY_EXAMINE];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_G] = ['g',Game.Bindings.Actions.Inventory.INVENTORY_GET];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_F] = ['f',Game.Bindings.Actions.Inventory.INVENTORY_FLING];

Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_L] = ['l',Game.Bindings.Actions.Targeting.LOOK];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_T] = ['t',Game.Bindings.Actions.Targeting.USE_OLD_TARGET];
Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_SPACE] = ["' '",Game.Bindings.Actions.Targeting.CLEAR_OLD_TARGET];

Game.Bindings['BindingSet_Numpad']['isKeydown'][ROT.VK_BACK_SLASH] = ['\\',Game.Bindings.Actions.Meta.SWITCH_KEYBINDING];

Game.Bindings['BindingSet_Numpad']['isKeydown']['isShift'] = {}
Game.Bindings['BindingSet_Numpad']['isKeydown']['isShift'][ROT.VK_E] = ['E',Game.Bindings.Actions.Inventory.INVENTORY_EAT];
Game.Bindings['BindingSet_Numpad']['isKeydown']['isShift'][ROT.VK_W] = ['W',Game.Bindings.Actions.Inventory.INVENTORY_WEAR];

Game.Bindings['BindingSet_Numpad']['isKeypress'] = {};
Game.Bindings['BindingSet_Numpad']['isKeypress']['<'] = ['<',Game.Bindings.Actions.Moves.MOVE_ASCEND];
Game.Bindings['BindingSet_Numpad']['isKeypress']['>'] = ['>',Game.Bindings.Actions.Moves.MOVE_DESCEND];
Game.Bindings['BindingSet_Numpad']['isKeypress']['?'] = ['?',Game.Bindings.Actions.Meta.HELP];


///////////////////////////
// Laptop-oriented bindings
Game.Bindings['BindingSet_Laptop'] = {};
Game.Bindings['BindingSet_Laptop']['NAME'] = 'Laptop';
Game.Bindings['BindingSet_Laptop']['isKeydown'] = {};
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_Q] = ['q',Game.Bindings.Actions.Moves.MOVE_UL];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_W] = ['w',Game.Bindings.Actions.Moves.MOVE_U];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_E] = ['e',Game.Bindings.Actions.Moves.MOVE_UR];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_A] = ['a',Game.Bindings.Actions.Moves.MOVE_L];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_S] = ['s',Game.Bindings.Actions.Moves.MOVE_WAIT];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_D] = ['d',Game.Bindings.Actions.Moves.MOVE_R];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_Z] = ['z',Game.Bindings.Actions.Moves.MOVE_DL];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_X] = ['x',Game.Bindings.Actions.Moves.MOVE_D];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_C] = ['c',Game.Bindings.Actions.Moves.MOVE_DR];

Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_I] = ['i',Game.Bindings.Actions.Inventory.INVENTORY_LIST];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_H] = ['h',Game.Bindings.Actions.Inventory.INVENTORY_WIELD];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_G] = ['g',Game.Bindings.Actions.Inventory.INVENTORY_GET];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_F] = ['f',Game.Bindings.Actions.Inventory.INVENTORY_FLING];

Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_L] = ['l',Game.Bindings.Actions.Targeting.LOOK];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_T] = ['t',Game.Bindings.Actions.Targeting.USE_OLD_TARGET];
Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_SPACE] = ["' '",Game.Bindings.Actions.Targeting.CLEAR_OLD_TARGET];


Game.Bindings['BindingSet_Laptop']['isKeydown'][ROT.VK_BACK_SLASH] = ['\\',Game.Bindings.Actions.Meta.SWITCH_KEYBINDING];

Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'] = {}
Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'][ROT.VK_D] = ['D',Game.Bindings.Actions.Inventory.INVENTORY_DROP];
Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'][ROT.VK_E] = ['E',Game.Bindings.Actions.Inventory.INVENTORY_EAT];
Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'][ROT.VK_H] = ['H',Game.Bindings.Actions.Inventory.INVENTORY_WEAR];
Game.Bindings['BindingSet_Laptop']['isKeydown']['isShift'][ROT.VK_X] = ['X',Game.Bindings.Actions.Inventory.INVENTORY_EXAMINE];

Game.Bindings['BindingSet_Laptop']['isKeypress'] = {};
Game.Bindings['BindingSet_Laptop']['isKeypress']['<'] = ['<',Game.Bindings.Actions.Moves.MOVE_ASCEND];
Game.Bindings['BindingSet_Laptop']['isKeypress']['>'] = ['>',Game.Bindings.Actions.Moves.MOVE_DESCEND];
Game.Bindings['BindingSet_Laptop']['isKeypress']['?'] = ['?',Game.Bindings.Actions.Meta.HELP];

