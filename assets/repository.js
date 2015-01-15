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


// Create an object based on a template.
Game.Repository.prototype.create = function(name, extraProperties) {
    if (!this._templates[name]) {
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
    
    if (new_obj.getKey) {
        Game.ALL_THINGS[new_obj.getKey()] = new_obj;
    }
    
    return new_obj;
};

// Create an object based on a random template
Game.Repository.prototype.createRandom = function() {
    // Pick a random key and create an object based off of it.
    return this.create(Object.keys(this._randomTemplates).random());};