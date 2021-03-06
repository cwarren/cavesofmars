Game.AuxScreen = {};

// upper left, upper right, lower left, and lower right display areas
//  upper left = avatar
//  upper right = help
//  lower left = messages
//  lower right = info

Game.AuxScreen.avatarScreen = {
    _player: null,
    _display: null,
    _width: 1,
    _height: 1,
    _colors: '%c{#ccc}%b{black}',
    init: function(w,h,player) {
        this._width = w;
        this._height = h;
        this._display  = new ROT.Display({width: w, height: h, spacing:Game.SPACING});
        this._player = player;
    },
    getDisplay: function(display) {
        return this._display;
    },
    setPlayer: function(player) {
        this._player = player;
    },
    getColorForHp: function (hpFraction) {
        if (hpFraction > .95) {
            return '%c{black}%b{green}';
        } else if (hpFraction > .90) {
            return '%c{green}%b{black}';

        } else if (hpFraction < .1) {
            return '%c{black}%b{red}';
        } else if (hpFraction < .2) {
            return '%c{red}%b{black}';
        } else if (hpFraction < .35) {
            return '%c{orange}%b{black}';
        } else if (hpFraction < .5) {
            return '%c{yellow}%b{black}';
        }

        return this._colors;
    },
    render: function() {
        if (this._player.getHp() <= 0) {
            this._display.drawText(0,1,'%c{black}%b{red}!! D E A D !!');
        } else {
            
            this._display.drawText(0,1,this.getColorForHp(this._player.getHp()/this._player.getMaxHp())+vsprintf('HP: %d/%d', [this._player.getHp(), this._player.getMaxHp()]));
        }
        // hunger
        this._display.drawText(0,2, this._player.getHungerState());        
        
        // melee atk
        // ranged atk
        this._display.drawText(0,4,this._colors+vsprintf('Melee Atk: %d', [this._player.getAttackValue()]));
        this._display.drawText(0,5,this._colors+vsprintf('Range Atk: %d', [this._player.getRangedAttackValue()]));
        
        // defense
        this._display.drawText(0,7,this._colors+vsprintf('Defense: %d', [this._player.getDefenseValue()]));
        
        // digging
        this._display.drawText(0,9,this._colors+vsprintf('Digging: %d', [this._player.getDigRate()]));

        var y = 11
        
        var heldItem = this._player.getHolding();
        if (heldItem) {
            y += this._display.drawText(0,y, heldItem.getRepresentation() + ' ' +heldItem.getName());
            if (! heldItem.isArmor()) {
                if (heldItem.getAttackValue() != 0 || heldItem.getDefenseValue() != 0) {
                    y += this._display.drawText(1,y,vsprintf('atk: %s, def: %s',[heldItem.getAttackValue(),heldItem.getDefenseValue()]));
                }
                if (heldItem.hasMixin('Shooter')) {
                    y += this._display.drawText(1,y,vsprintf('%s: x%s, +%s',[heldItem.getAllowedAmmoStr(),heldItem.getRangedAttackDamageMultipler(),heldItem.getRangedAttackDamageAdder()]));
                }
                if (heldItem.hasMixin('DigTool')) {
                    y += this._display.drawText(1,y,vsprintf('dig: +%s, x%s',[heldItem.getDigAdder(),heldItem.getDigMultiplier()]));
                }
            }
            y++;
        }

        var armor = this._player.getWearing();
        if (armor) {
            y += this._display.drawText(0,y, armor.getRepresentation() + ' ' +armor.getName());
            if (armor.hasMixin('Shooter')) {
                y += this._display.drawText(1,y,vsprintf('%s: x%s, +%s',[armor.getAllowedAmmoStr(),armor.getRangedAttackDamageMultipler(),armor.getRangedAttackDamageAdder()]));
            }
            if (armor.hasMixin('DigTool')) {
                y += this._display.drawText(1,y,vsprintf('dig: +%s, x%s',[armor.getDigAdder(),armor.getDigMultiplier()]));
            }
            y += this._display.drawText(1,y,vsprintf('def: %s, atk: %s',[armor.getDefenseValue(),armor.getAttackValue()]));
            y++;
        }


        // level
        // current xp
        this._display.drawText(0,this._height-5,this._colors+vsprintf('Level: %d (%d/%d)  ', [this._player.getLevel(),this._player.getExperience(), this._player.getNextLevelExperience()]));
        
        // map name and depth
        var map = this._player.getMap();
        if (map) {
            this._display.drawText(0,this._height-3, this._colors+this._player.getMap().getMapName());
            this._display.drawText(0,this._height-2, this._colors+vsprintf('Stage %d ', [this._player.getZ()+1]));
        }

    },
    refresh: function() {
        this._display.clear();
        this.render();
    }
};


Game.AuxScreen.helpScreen = {
    _display: null,
    _width: 1,
    _height: 1,
    _characterLookups: null,
    _bindingSet: null,
    _color: '%c{#ddd}%b{darkBlue}',
    init: function(w,h) {
        this._width = w;
        this._height = h;
        this._display  = new ROT.Display({width: w, height: h, spacing:Game.SPACING}); 
    },
    getDisplay: function(display) {
        return this._display;
    },
    setForBinding: function(bindingSet) {
        this._bindingSet = bindingSet;
        this._characterLookups = Game.Bindings.getDisplayStringsForActions(bindingSet);
        this.render();
    },
    getForBinding: function() {
        return this._bindingSet;
    },
    getCharacterLookups: function() {
        return this._characterLookups;
    },
    render: function(commandSets) {
        if (! this._bindingSet) {
            return;
        }
        
        if (! commandSets) {
            commandSets = [];
        }

        var y = 0;        
        //this._display.drawText(4,y,'Movement');
        
        //y++;
        if (commandSets.indexOf('movement') > -1) {
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_UL.unique_id]);
            this._display.drawText(3,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_U.unique_id]);
            this._display.drawText(5,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_UR.unique_id]);

            y++;
            this._display.drawText(2,y,'\\');
            this._display.drawText(3,y,'|');
            this._display.drawText(4,y,'/');
            if (commandSets.indexOf('levels') > -1) {
                this._display.drawText(8,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_ASCEND.unique_id]);
                this._display.drawText(10,y,Game.Bindings.Actions.Moves.MOVE_ASCEND.word);
            }
            
            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_L.unique_id]);
            this._display.drawText(2,y,'-');
            this._display.drawText(3,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_WAIT.unique_id]);
            this._display.drawText(4,y,'-');
            this._display.drawText(5,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_R.unique_id]);

            y++;
            this._display.drawText(2,y,'/');
            this._display.drawText(3,y,'|');
            this._display.drawText(4,y,'\\');
            if (commandSets.indexOf('levels') > -1) {
                this._display.drawText(8,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_DESCEND.unique_id]);
                this._display.drawText(10,y,Game.Bindings.Actions.Moves.MOVE_DESCEND.word);
            }
            
            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_DL.unique_id]);
            this._display.drawText(3,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_D.unique_id]);
            this._display.drawText(5,y,this._color+this._characterLookups[Game.Bindings.Actions.Moves.MOVE_DR.unique_id]);
    
            y += 2;
        }        

        if (commandSets.indexOf('worldinteraction') > -1) {
        
            this._display.drawText(1,y,
                this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_GET.unique_id]+'%b{#000},'+this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_GET_TO_HANDS.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_GET.word+','+Game.Bindings.Actions.Inventory.INVENTORY_GET_TO_HANDS.word);

/*
        
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_GET.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_GET.word);

            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_GET_TO_HANDS.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_GET_TO_HANDS.word);
*/
            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.World.BUILD.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.World.BUILD.word);
            
            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.World.ACTIVATE.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.World.ACTIVATE.word);
            
            y += 2;
        }
        
        if (commandSets.indexOf('inventory') > -1) {
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_LIST.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_LIST.word);

            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_EXAMINE.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_EXAMINE.word);

            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_FLING.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_FLING.word);

            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_DROP.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_DROP.word);

            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_HOLD.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_HOLD.word);

            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_WEAR.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_WEAR.word);

            if (commandSets.indexOf('inventory_advanced') > -1) {
                y++;
                this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_EAT.unique_id]);
                this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_EAT.word);

                y++;
                this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_USE.unique_id]);
                this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_USE.word);

                y++;
                this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_CRAFT.unique_id]);
                this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_CRAFT.word);

                y++;
                this._display.drawText(1,y,
                    this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_PACK.unique_id]+'%b{#000},'+this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_UNPACK.unique_id]);
                this._display.drawText(5,y,Game.Bindings.Actions.Inventory.INVENTORY_PACK.word+','+Game.Bindings.Actions.Inventory.INVENTORY_UNPACK.word);
                
                y++;
                this._display.drawText(1,y,
                    this._color+this._characterLookups[Game.Bindings.Actions.Knowledge.KNOWLEDGE_CRAFT.unique_id]+'%b{#000},'+this._color+this._characterLookups[Game.Bindings.Actions.Knowledge.KNOWLEDGE_BUILD.unique_id]);
                this._display.drawText(5,y,Game.Bindings.Actions.Knowledge.KNOWLEDGE_CRAFT.word+','+Game.Bindings.Actions.Knowledge.KNOWLEDGE_BUILD.word);
                
            } else {
                y++;
                this._display.drawText(1,y,"also "+this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_EAT.unique_id]+'%b{#000}, '+
                                                   this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_USE.unique_id]+'%b{#000}, '+
                                                   this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_CRAFT.unique_id]+'%b{#000}, '+
                                                   this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_PACK.unique_id]+'%b{#000}, '+
                                                   this._color+this._characterLookups[Game.Bindings.Actions.Inventory.INVENTORY_UNPACK.unique_id]);
                y++;
                this._display.drawText(1,y,"also "+this._color+this._characterLookups[Game.Bindings.Actions.Knowledge.KNOWLEDGE_CRAFT.unique_id]+'%b{#000}, '+
                                                   this._color+this._characterLookups[Game.Bindings.Actions.Knowledge.KNOWLEDGE_BUILD.unique_id]+'%b{#000}');
            }

            y += 2;
        }
        
        if (commandSets.indexOf('datanav') > -1) {
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.DataNav.PAGE_UP.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.DataNav.PAGE_UP.word);
            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.DataNav.PAGE_DOWN.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.DataNav.PAGE_DOWN.word);
            y += 2;
        }

        if (commandSets.indexOf('sense') > -1) {
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.World.LOOK.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.World.LOOK.word);
            y += 2;
        }

        if (commandSets.indexOf('targeting') > -1) {
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Targeting.USE_OLD_TARGET.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Targeting.USE_OLD_TARGET.word);
            y++;

            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Targeting.CLEAR_OLD_TARGET.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Targeting.CLEAR_OLD_TARGET.word);
            y++;

            this._display.drawText(1,y,this._color+'[Enter]');
            this._display.drawText(10,y,'do it');

            y += 2;

        }

        if (commandSets.indexOf('meta') > -1) {
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Meta.SWITCH_KEYBINDING.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Meta.SWITCH_KEYBINDING.word);

            y++;
            this._display.drawText(1,y,this._color+this._characterLookups[Game.Bindings.Actions.Meta.HELP.unique_id]);
            this._display.drawText(5,y,Game.Bindings.Actions.Meta.HELP.word);
        }
    },
    refresh: function(commandSets) {
        this._display.clear();
        this.render(commandSets);
    }
};

Game.AuxScreen.messageScreen = {
    _player: null,
    _display: null,
    _width: 1,
    _height: 1,
    _new_message_color: '%c{white}%b{black}',
    _archive_message_color: '%c{#aaa}%b{black}',
    init: function(w,h,player) {
        this._width = w;
        this._height = h;
        this._display  = new ROT.Display({width: w, height: h, spacing:Game.SPACING});
        this._player = player;
    },
    getDisplay: function(display) {
        return this._display;
    },
    setPlayer: function(player) {
        this._player = player;
    },
    render: function() {
        // Get the messages in the player's queue and render them
        var messages = this._player.getMessages();
        var messageY = 0;
        for (var i = 0; i < messages.length; i++) {
            // Draw each message, adding the number of lines
            messageY += this._display.drawText(
                0, 
                messageY,
                this._new_message_color + messages[i]
            );
        }
        var displayedArchiveMessages = 0;
        var messageArchives = this._player.getMessageArchives();
        while ((messageY < this._height) && (displayedArchiveMessages < messageArchives.length)) {
            messageY += this._display.drawText(
                0, 
                messageY,
                this._archive_message_color + messageArchives[displayedArchiveMessages]
            );
            displayedArchiveMessages++;
        }
    },
    refresh: function() {
        this._display.clear();
        this.render();
    }
};


Game.AuxScreen.infoScreen = {
    _display: null,
    _width: 1,
    _height: 1,
    _current_short_info: '',
    _current_detail_info: '',
    init: function(w,h) {
        this._width = w;
        this._height = h;
        this._display  = new ROT.Display({width: w, height: h, spacing:Game.SPACING}); 
    },
    getDisplay: function(display) {
        return this._display;
    },
    setCurrentShortInfo: function(info) {
        this._current_short_info = info;
    },
    setCurrentDetailInfo: function(info) {
        this._current_detail_info = info;
    },
    render: function() {
        var displayY = 0;
        if (this._current_short_info) {
            displayY += this._display.drawText(0,displayY,this._current_short_info);
            displayY++;
        }
        if (this._current_detail_info) {
            displayY += this._display.drawText(0,displayY,this._current_detail_info);
        }
    },
    refresh: function() {
        this._display.clear();
        this.render();
    }
};
