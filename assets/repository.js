Game.ALL_THINGS = {}; // hash keyed by unique ids

// A repository has a name and a constructor. The constructor is used to create
// items in the repository.
Game.Repository = function(name, obj_constructor) {
    this._name = name;
    this._templates = {};
    this._obj_constructor = obj_constructor;

    this._randomTemplates = {};
};

// Define a new named template.
Game.Repository.prototype.define = function(name, template, options) {
    this._templates[name] = template;
    // Apply any options
    var disableRandomCreation = options && options['disableRandomCreation'];
    if (!disableRandomCreation) {
        this._randomTemplates[name] = template;
    }
};

Game.Repository.prototype.has = function(name) {
    if (this._templates[name]) { return true; }
    return false;
}


// Create an object based on a template.
Game.Repository.prototype.create = function(name, extraProperties) {
    if (!this.has(name)) {
        throw new Error("No template named '" + name + "' in repository '" +
            this._name + "'");
    }

    //console.log('creating '+name+' with extraProperties ');
    //console.dir(extraProperties);
    
    // Copy the template
    var template = Object.create(this._templates[name]);
    
    // Apply any extra properties
    if (extraProperties) {
        for (var key in extraProperties) {
            if (key == 'mixins') {
//                console.log('handling mixin property');
                if (! ('mixins' in template)) {
//                    console.log('no mixins property');
                    template['mixins'] = extraProperties['mixins'];
                } else {
                    for (var i=0;i<extraProperties['mixins'].length;i++) {
                        if (template['mixins'].indexOf(extraProperties['mixins'][i]) == -1) {
                            template['mixins'].push(extraProperties['mixins'][i]);
                        }
                    }
                }
                
            } else {
                template[key] = extraProperties[key];
            }
        }
    }
    
//    console.log('modified template');
//    console.dir(template);
//    console.log('----');
    
    // Create the object, passing the template as an argument
    var new_obj = new this._obj_constructor(template);
    
    if (new_obj.getKey) {
        Game.ALL_THINGS[new_obj.getKey()] = new_obj;
    }
    
    return new_obj;
};


// Create an array of object based on an array of templates template.
Game.Repository.prototype.createSet = function(names, extraProperties) {
    //console.dir(this);
    
    if (names == 'ALL') {
        names = Object.keys(this._templates);
    }

    //console.dir(names);

    var objSet = [];

    for (i=0;i<names.length;i++) {
        var name = names[i];
        
        if (!this.has(name)) {
            throw new Error("No template named '" + name + "' in repository '" +
                this._name + "'");
        }

        // Copy the template
        var template = Object.create(this._templates[name]);

        // Apply any extra properties
        if (extraProperties) {
            for (var key in extraProperties) {
                template[key] = extraProperties[key];
            }
        }

        //console.log('creating '+name);

        // Create the object, passing the template as an argument
        var new_obj = new this._obj_constructor(template);

        //console.dir(new_obj);

        objSet.push(new_obj);
        
        //console.dir(objSet[i]);

        if (new_obj.getKey) {
            Game.ALL_THINGS[new_obj.getKey()] = new_obj;
        }
        
        
    }
    
//    console.dir(objSet);
    
    return objSet;
};

// Create an object based on a random template
Game.Repository.prototype.createRandom = function() {
    // Pick a random key and create an object based off of it.
    return this.create(Object.keys(this._randomTemplates).random());
};