////////////////////////////////////////////////////////////////
// BEHAVIORS

Game.EntityBehaviors = {};

// this only move to empty floor spaces
Game.EntityBehaviors.PeacefulWanderBehavior = {
    name: 'PeacefulWanderBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {
        if (actor.hasMixin('MoveChooser')) {
            var moveTarget = actor.getMoveCoord();
            actor.tryMove(moveTarget.x, moveTarget.y, actor.getZ());
        }
        return this;
    }
    
};

// this move anywhere, including into walls (and so will dig if entity is also Digger) and into other creatures (and so will attack if also MeleeAttacker)
Game.EntityBehaviors.DangerousWanderBehavior = {
    name: 'DangerousWanderBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {
        if (actor.hasMixin('MoveChooser')) {
            var moveTarget = actor.getMoveCoord();
            actor.tryMove(moveTarget.x, moveTarget.y, actor.getZ());
        }
        return this;
    }
    
};

// attack the player if nearby, otherwise move anywhere, including into walls (and so will dig if entity is also Digger) and into other creatures (and so will attack if also MeleeAttacker)
Game.EntityBehaviors.AggressiveWanderBehavior = {
    name: 'AggressiveWanderBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {

        var attackRes = Game.EntityBehaviors.MeleeAttackerBehavior.doBehavior(actor);
        if (attackRes) {
            return attackRes;
        }

        if (actor.hasMixin('MoveChooser')) {
            var moveTarget = actor.getMoveCoord();
            actor.tryMove(moveTarget.x, moveTarget.y, actor.getZ());
        }

        return this;
    }
    
};


// this move anywhere, including into walls (and so will dig if entity is also Digger) and into other creatures (and so will attack if also MeleeAttacker)
Game.EntityBehaviors.MeleeAttackerBehavior = {
    name: 'MeleeAttackerBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {
        if (! actor.hasMixin('MeleeAttacker')) {
            return false;
        }

        if (actor.hasMixin('Retaliator')) {
            var retaliationTarget = actor.getRetaliationTarget();
            if (retaliationTarget) {
                if (Game.util.coordsAreAdjacent(retaliationTarget.getX(),retaliationTarget.getY(),actor.getX(),actor.getY())
                    && (retaliationTarget.getZ()==actor.getZ()) 
                   )
                {
                    actor.attack(retaliationTarget);
                    return this;
                }
                
                if (actor.hasMixin('Seer') && actor.canSee(retaliationTarget)) {
                    return false;
                }
            }
        }
        
        

        // If we are adjacent to another entity, attack it
        var adjCoords = Game.util.coordsNeighboring(actor.getX(),actor.getY());
        for (var i=0; i<adjCoords.length; i++) {
            var adjEntity = actor.getMap().getEntityAt(adjCoords[i].x,adjCoords[i].y,actor.getZ());
            if (adjEntity) {
                if (actor.hasMixin('Allier')) {
                    if (actor.isAlliedWith(adjEntity)) {
                        continue;
                    }
                }
                actor.attack(adjEntity);
                return this;
            }
        }
        
        return false;
    }
    
};


// this move anywhere, including into walls (and so will dig if entity is also Digger) and into other creatures (and so will attack if also MeleeAttacker)
Game.EntityBehaviors.MeleeHunterBehavior = {
    name: 'MeleeHunterBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {
        var player = actor.getMap().getPlayer();
        
        var attackRes = Game.EntityBehaviors.MeleeAttackerBehavior.doBehavior(actor);
        if (attackRes) {
            return attackRes;
        }

        // Generate the path and move to the first tile.
        var source = actor;
        var z = actor.getZ();
        var path = new ROT.Path.AStar(player.getX(), player.getY(), function(x, y) {
            // If an entity is present at the tile, can't move there.
            var entity = source.getMap().getEntityAt(x, y, z);
            if (entity && entity !== player && entity !== source) {
                return false;
            }
            return source.getMap().getTile(x, y, z).isWalkable();
        }, {topology: 8});

        // Once we've gotten the path, we want to move to the second cell that is
        // passed in the callback (the first is the entity's starting point)
        var count = 0;
        path.compute(source.getX(), source.getY(), function(x, y) {
            if (count == 1) {
                source.tryMove(x, y, z);
            }
            count++;
        });


        return this;
    }
    
};

/*

Game.EntityBehaviors.SafePathMovementBehavior = {
    name: 'SafePathMovementBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {
        // if current location is explorationTarget, then return false
        // if next step in path is dangerous, return false
        // move to the next step in the path (destructive to path data - unshift)
        // return this
    }
}

Game.EntityBehaviors.ExplorerBehavior = {
    name: 'ExplorerBehavior',
    groupName: 'Behavior',
    doBehavior: function(actor) {
        // if current location is explorationTarget, then chooseExplorationTarget
        // if  next step in the exploration path contains or is adjacent to a non-allied entity that has MeleeAttackerBehavior, then
            // if adjacent safe space exists
                // move to it
                // return this
        // move to next step in the exploration path
        // return this
    },
    chooseExplorationTarget: function(actor) {
        // pick an interesting space within sensing range and set it to explorationTarget
        if (actor.isA('Seer')) {
            var r = actor.getSightRadius();
            var dx = Game.util.getRandomInteger(r*-1,r);
            var dy = Game.util.getRandomInteger(r*-1,r);
            var tryCount = 0;
            while (! actor.canSeeCoord_delta(dx,dy) && tryCount < 25) {
                dx = Game.util.getRandomInteger(r*-1,r);
                dy = Game.util.getRandomInteger(r*-1,r);
                tryCount++;
            }
            
            if (tryCount >= 25) { return Game.EntityBehaviors.DangerousWanderBehavior; }
            this._explorationTarget.x
        }
        
        // set up the exploration path (avoid tiles containing or adjacent to non-allied entities that have MeleeAttackerBehavior)
        // set explorationPathStep to 0
        this._explorationPathStep = 0;
        
    }
}

Game.EntityBehaviors.FleeingBehavior = {
}

Game.EntityBehaviors.CollectorBehavior = {
}

Game.EntityBehaviors.EquipperBehavior = {
}
*/

////////////////////////////////////////////////////////////////
// MOVEMENT AND TARGET CHOOSERS


Game.EntityMixins.RandomMoveChooser = {
    name: 'RandomMoveChooser',
    groupName: 'MoveChooser',
    init: function(template) {
        this._maxMoveAttempts = template['maxMoveAttempts'] || 8;
        this._bumpsThings = template['bumpsThings'] || false;
    },
    getMoveCoord: function() {
        var neighbors = Game.util.coordsNeighboring(this.getX(),this.getY());
        var moveTarget = neighbors.random();
        if (this._bumpsThings) {
            return moveTarget;
        }
        var map = this.getMap();
        //console.dir(map);
        var attemptLimiter = this._maxMoveAttempts;
        while (attemptLimiter > 0 && ! map.isWalkable(moveTarget.x, moveTarget.y, this.getZ())) {
            moveTarget = neighbors.random();
            attemptLimiter--;
        }
        if (attemptLimiter > 0) {
            return moveTarget;
        }
        
        return {x: this.getX(), y: this.getY()};
    },
    listeners: {
    }
};


Game.EntityMixins.ExplorationMoveChooser = {
    name: 'ExplorationMoveChooser',
    groupName: 'MoveChooser',
    init: function(template) {
        this._priorPath = [];
        this._targetPath = [];
        this._target = {x:0,y:0};
    },
    getMoveCoord: function() {
    },
    getTarget: function() {
        return this._target;
    },
    setTarget: function(v) {
        this._target = v;
    },
    calculateTargetPath: function() {
    },
    listeners: {
        onMovedTo: function(movedTo) {
        }
    }
};


////////////////////////////////////////////////////////////////
// ACTORS & BEHAVIOR CONTROLLERS

// CSW NOTE: PeacefulRoamingBehaviorController and AggressiveRoamingBehaviorController are VERY similar - consider how they might be combined / refactored (possibly using extendedObj from util)

Game.EntityMixins.PeacefulRoamingBehaviorController = {
    name: 'PeacefulRoamingBehaviorController',
    groupName: 'Actor',
    init: function(template) {
        this._behaviors = template['behaviors'] || [Game.EntityBehaviors.PeacefulWanderBehavior];
        this._baseBehavior = template['baseBehavior'] || Game.EntityBehaviors.PeacefulWanderBehavior;
        this._currentBehavior = Game.EntityBehaviors.PeacefulWanderBehavior;
    },
    act: function() {
        if (! this.handleOngoingAction()) {
            if (! this._currentBehavior) {
                this._currentBehavior = this._baseBehavior;
            }
            this._currentBehavior = this._currentBehavior.doBehavior(this);
            if (! this._currentBehavior) {
                this.act();
            }

            this.getMap().getScheduler().setDuration(this.getLastActionDuration());
            this.setLastActionDuration(this.getDefaultActionDuration());

            this.raiseEvent('onActed');
        }
    }
}

Game.EntityMixins.AggressiveRoamingBehaviorController = {
    name: 'AggressiveRoamingBehaviorController',
    groupName: 'Actor',
    init: function(template) {
        this._behaviors = template['behaviors'] || [Game.EntityBehaviors.DangerousWanderBehavior];
        this._baseBehavior = template['baseBehavior'] || Game.EntityBehaviors.DangerousWanderBehavior;
        this._currentBehavior = this._baseBehavior;
    },
    act: function() {
        //console.dir(this);
        if (! this.handleOngoingAction()) {
            if (! this._currentBehavior) {
                this._currentBehavior = this._baseBehavior;
            }
            if (this.hasMixin('Seer') && this.canSee(this.getMap().getPlayer())) {
                if (this.hasMixin('Allier') && ! this.isAlliedWith(this.getMap().getPlayer()) ) {
                    this._currentBehavior = Game.EntityBehaviors.MeleeHunterBehavior;
                }
            }
            this._currentBehavior = this._currentBehavior.doBehavior(this);
            if (! this._currentBehavior) {
                this.act();
            }

            this.getMap().getScheduler().setDuration(this.getLastActionDuration());
            this.setLastActionDuration(this.getDefaultActionDuration());

            this.raiseEvent('onActed');
        }
    }
}

/*
Game.EntityMixins.TargetedMovementBehaviorController = {
    name: 'TargetedMovementBehaviorController',
    groupName: 'Actor',
    init: function(template) {
        this._behaviors = template['behaviors'] || [Game.EntityBehaviors.ExplorerBehavior];
        this._baseBehavior = template['baseBehavior'] || Game.EntityBehaviors.ExplorerBehavior;
        this._currentBehavior = this._baseBehavior;
        this._behaviorMode = 'exploratory'; // [exploratory|fleeing|recovering|hunting|hostile]
    },
    act: function() {
        //console.dir(this);
        if (! this.handleOngoingAction()) {

            if (this._behaviorMode == 'exploratory') {
            
                if (! this._currentBehavior) {
                    this._currentBehavior = this._baseBehavior;
                }

                // check for conditions that change _currentBehavior
//                if (this.hasMixin('Seer') && this.canSee(this.getMap().getPlayer())) {        
//                    this._currentBehavior = Game.EntityBehaviors.MeleeHunterBehavior;
//                }

                this._currentBehavior = this._currentBehavior.doBehavior(this);
                if (! this._currentBehavior) {
                    this.act();
                }
            }
            else if (this._behaviorMode == 'fleeing') {
            }
            else if (this._behaviorMode == 'recovering') {
            }
            else if (this._behaviorMode == 'hunting') {
            }
            else if (this._behaviorMode == 'hostile') {
            }
            else {
                this._behaviorMode = 'exploratory';
                this._currentBehavior = this._baseBehavior;
                this.act();
                return;
            }
            

            this._currentBehavior = this._currentBehavior.doBehavior(this);
            if (! this._currentBehavior) {
                this.act();
            }

            this.getMap().getScheduler().setDuration(this.getLastActionDuration());
            this.setLastActionDuration(this.getDefaultActionDuration());

            this.raiseEvent('onActed');
        }
    }
}
*/


Game.EntityMixins.GiantZombieActor = Game.util.extendedObj(Game.EntityMixins.AggressiveRoamingBehaviorController, {
    init: function(template) {
        Game.EntityMixins.AggressiveRoamingBehaviorController.init.call(this,template);
        
        // We only want to grow the arm once.
        this._hasGrownArm = false;
    },
    growArm: function() {
        this._hasGrownArm = true;
        this.increaseAttackValue(12);
        // Send a message saying the zombie grew extra appendages.
        Game.sendMessageNearby(this.getMap(),
            this.getX(), this.getY(), this.getZ(),
            'Whip-like appendages suddenly lift out of the giant zombie!');
    },
    spawnOoze: function() {
        // Generate a random position nearby.
        var xOffset = Math.floor(Math.random() * 3) - 1;
        var yOffset = Math.floor(Math.random() * 3) - 1;

        // Check if we can spawn an entity at that position.
        if (!this.getMap().isEmptyFloor(this.getX() + xOffset, this.getY() + yOffset,
            this.getZ())) {
            // If we cant, do nothing
            return;
        }

        // Create the entity
        var ooze = Game.EntityRepository.create('ooze');
        ooze.setX(this.getX() + xOffset);
        ooze.setY(this.getY() + yOffset)
        ooze.setZ(this.getZ());
        ooze.raiseEvent('onSpawned',[2,3,3,4,4,4,5,6].random());
        this.getMap().addEntity(ooze);
    },
    listeners: {
        onDamaged: function(attacker) {
            if ((!this._hasGrownArm) && (this.getHp() <= this.getMaxHp()*.66)) {
                this.growArm();
            }
        },
        onActed: function() {
            if (Math.round(Math.random() * 100) <= 20) {
                this.spawnOoze();
            }
        },
        onDeath: function(attacker) {
            // Switch to win screen when killed!
            Game.switchScreen(Game.Screen.winScreen);
        }
    }
});
    
    
Game.EntityMixins.FruitingFungusActor = {
    name: 'FruitingFungusActor',
    groupName: 'Actor',
    init: function() {
        this._growthsRemaining = 5;
    },
    act: function() {
        //console.log('GrowingFungusActor '+Math.random());
        // Check if we are going to try growing this turn
        if (! this.handleOngoingAction()) {
            if (this._growthsRemaining > 0) {
                if (ROT.RNG.getUniform() <= 0.01) {
                    // Generate the coordinates of a random adjacent square by
                    // generating an offset between [-1, 0, 1] for both the x and
                    // y directions. To do this, we generate a number from 0-2 and then
                    // subtract 1.
                    var xOffset = Math.floor(ROT.RNG.getUniform() * 3) - 1;
                    var yOffset = Math.floor(ROT.RNG.getUniform() * 3) - 1;
                    // Make sure we aren't trying to spawn on the same tile as us
                    if (xOffset != 0 || yOffset != 0) {
                        // Check if we can actually spawn at that location, and if so
                        // then we grow!
                        if (this.getMap().isEmptyFloor(this.getX() + xOffset,
                                                       this.getY() + yOffset,
                                                       this.getZ())) {
                            var entity;
                            if (ROT.RNG.getUniform() < .25) {
                                entity = Game.EntityRepository.create('fruiting fungus');
                            } else {
                                entity = Game.EntityRepository.create('quiescent fungus');
                            }
                            entity.setPosition(this.getX() + xOffset,this.getY() + yOffset,this.getZ());
                            entity.raiseEvent('onSpawned',this.getZ());
                            this.getMap().addEntity(entity);
                            this._growthsRemaining--;
                        }
                    }
                }
                this.getMap().getScheduler().setDuration(this.getLastActionDuration());
                this.setLastActionDuration(this.getDefaultActionDuration());
            } else {
                // once this has run out of growths replace it with a quiescent fungus
                this.raiseEvent('onSuicide');
            }
        }
    },
    getGrowthsRemaining: function() {
        return this._growthsRemaining;
    },
    setGrowthsRemaining: function(numGrowths) {
        this._growthsRemaining = numGrowths;
    },
    listeners: {
        onSpawned: function(onLevel) {
            this.increaseDefenseValue(Math.max(0,onLevel-1));
            this.increaseMaxHp(Math.max(0,4*(onLevel-1)));
        }
    }
}

Game.EntityMixins.DocileFungusActor = {
    name: 'DocileFungusActor',
    groupName: 'Actor',
    init: function() {
        this._growthsRemaining = 15;
    },
    act: function() {
        //console.log('GrowingFungusActor '+Math.random());
        // Check if we are going to try growing this turn
        if (! this.handleOngoingAction()) {
            if (this._growthsRemaining > 0) {
                var adjCoords = Game.util.coordsNeighboring(this.getX(),this.getY());
                var map = this.getMap();
                var z = this.getZ();

                var spreadCount = 0;

                for (var i=0; i<adjCoords.length; i++) {
                    var x = adjCoords[i].x;
                    var y = adjCoords[i].y;

                    var adjEntity = map.getEntityAt(x,y,z);
                    var adjItems = map.getItemsAt(x,y,z);

                    // if there's no entity in the way then see if there are any adjacent corpses to spread to
                    if (!adjEntity && adjItems) {
                        for (var j=0;j<adjItems.length;j++) {                    
                            if ((adjItems[j].getSuperGroup() == 'corpse') && (adjItems[j].getGroup() != 'fungus corpse')) {

                                if (ROT.RNG.getUniform() < .4) {

                                    var corpse = adjItems[j];

                                    // remove the corpse
                                    map.removeItem(adjItems[j],x,y,z);

                                    // spawn a docile fungus entity
                                    var entity = Game.EntityRepository.create('docile fungus');
                                    entity.raiseEvent('onSpawnedFromCorpse',corpse);
                                    entity.setPosition(x,y,z);
                                    this.getMap().addEntity(entity);
                                    this._growthsRemaining--;
                                    break;
                                }
                            }
                        }
                    }
                }

                this.getMap().getScheduler().setDuration(this.getLastActionDuration());
                this.setLastActionDuration(this.getDefaultActionDuration());
            }
        }
    },
    getGrowthsRemaining: function() {
        return this._growthsRemaining;
    },
    setGrowthsRemaining: function(numGrowths) {
        this._growthsRemaining = numGrowths;
    },
    listeners: {
        onSpawnedFromCorpse: function(corpse) {
            this.adjustCorpseFoodValue(Game.util.getRandomInteger(1,2*corpse.getFoodValue()));
        }
    }
}

Game.EntityMixins.SpreadingFungusActor = {
    name: 'SpreadingFungusActor',
    groupName: 'Actor',
    init: function() {
        this._senescence_countdown = 10;
    },
    act: function() {
        if (! this.handleOngoingAction()) {
            var adjCoords = Game.util.coordsNeighboring(this.getX(),this.getY());
            var map = this.getMap();
            var z = this.getZ();

            var spreadCount = 0;

            // NOTE: attacks ALL adjacent enemies on its turn
            for (var i=0; i<adjCoords.length; i++) {
                var x = adjCoords[i].x;
                var y = adjCoords[i].y;

                var adjEntity = map.getEntityAt(x,y,z);
                var adjItems = map.getItemsAt(x,y,z);

                // first see if there's anything adjacent to attack
                if (adjEntity && ! this.isAlliedWith(adjEntity)) {
                    this.attack(adjEntity);
                } else {
                    // second, if there's no entity adjacent then see if there are any adjacent corpses to spread to
                    if (!adjEntity && adjItems) {
                        for (var j=0;j<adjItems.length;j++) {
                            if ((adjItems[j].getSuperGroup() == 'corpse') && (adjItems[j].getGroup() != 'fungus corpse')){
                                var corpse = adjItems[j];

                                // remove the corpse
                                map.removeItem(adjItems[j],x,y,z);

                                // spawn either a spreading fungus entity or a fungus zombie
                                var entity;
                                if (ROT.RNG.getUniform() < .25) {
                                    entity = Game.EntityRepository.create('fungus zombie');
                                    entity.raiseEvent('onSpawned',[1,z-1,z].random());

                                    spreadCount++;
                                } else {
                                    entity = Game.EntityRepository.create('spreading fungus');
                                }
                                entity.setPosition(x,y,z);
                                entity.raiseEvent('onSpawnedFromCorpse',corpse);
                                this.getMap().addEntity(entity);

                                spreadCount++;
                                break;
                            }
                        }
                    }
                }
            }

            // then do senescence check
            if (ROT.RNG.getUniform() <= 0.02) {
                this._senescence_countdown--;
            }
            this._senescence_countdown -= spreadCount;

            if (this._senescence_countdown < 1) {
                this.raiseEvent('onSuicide');
            }

            this.getMap().getScheduler().setDuration(this.getLastActionDuration());
            this.setLastActionDuration(this.getDefaultActionDuration());
        }
    },
    getSenescenceCountdown: function() {
        return this._senescence_countdown;
    },
    setSenescenceCountdown: function(c) {
        this._senescence_countdown = c;
    },
    listeners: {
        onSpawnedFromCorpse: function(corpse) {
            this.increaseMaxHp(Game.util.getRandomInteger(1,  Math.floor(corpse.getFoodValue()/4) ));
        }
    }
}

Game.EntityMixins.IsFungusZombie = {
    name: 'IsFungusZombie',
    listeners: {
        onSpawnedFromCorpse: function(corpse) {
            this.increaseMaxHp(Game.util.getRandomInteger(1, corpse.getFoodValue()) );
        }
    }
}
    

////////////////////////////////////////////////////////////////

// Main player's actor mixin
Game.EntityMixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function() {
        if (this._acting) {
            return;
        }
        this._acting = true;

        // Detect if the game is over
        if (!this.isAlive()) {
            Game.Screen.playScreen.setGameEnded(true);
            // Send a last message to the player
            Game.sendMessage(this, '%b{#c11}Press [Enter] to continue!');
        }

        // Re-render the screen
        Game.refresh();
                
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        this.getMap().getEngine().lock();

        // Clear the message queue
        this.clearMessages();
        this._acting = false;

        var hasOngoingAction = this.handleOngoingAction();
    },
    finishAction: function() {
        this.raiseEvent('onActed');
        //console.log('action takes: '+this.getLastActionDuration());
        this.getMap().getScheduler().setDuration(this.getLastActionDuration());
        this.setLastActionDuration(this.getDefaultActionDuration());
        this.getMap().getEngine().unlock();
    }
}
