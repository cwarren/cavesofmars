if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

Game.util = {
newArray2D: function (xdim,ydim,initVal) {
    var ar = [];
    for (var x = 0; x < xdim; x++) {
        // Create the nested array for the y values
        ar.push([]);
        // Add all the tiles
        for (var y = 0; y < ydim; y++) {
            ar[x].push(initVal);
        }
    }
    return ar;
},

coordsNeighboring: function(x,y) {
    var neighborCoords = [{x: x - 1, y: y - 1},
                          {x: x - 1, y: y},
                          {x: x - 1, y: y + 1},
                          {x: x, y: y - 1},
                          {x: x, y: y + 1},
                          {x: x + 1, y: y - 1},
                          {x: x + 1, y: y},
                          {x: x + 1, y: y + 1}];
    return neighborCoords.randomize();
},

generateRandomString: function(len) {
    var charSource = 'abcefghijklnoprstuvxyz1234567890'.split('');
    var res='';
    for (var i=0; i<len; i++) {
        res += charSource.random();
    }
    return res;
},

coordsAreAdjacent: function (x1,y1,x2,y2) {
    var offsetsX = Math.abs(x1 - x2);
    var offsetsY = Math.abs(y1 - y2);
    return ((offsetsX <= 1) && (offsetsY <= 1));
},

extendedObj: function (baseObj, extensions) {
    // Create a copy of the source.
    var result = {};
    for (var key in baseObj) {
        result[key] = baseObj[key];
    }
    // Copy over all keys from dest
    for (var key in extensions) {
        result[key] = extensions[key];
    }
    return result;
},

getRandomInteger: function (minValInclusive, maxValInclusive) {
    if (maxValInclusive <= minValInclusive) {
        return minValInclusive;
    }
    var randRange = maxValInclusive - minValInclusive + 1;
    return minValInclusive + Math.floor(ROT.RNG.getUniform() * randRange);
},

scanEventResultsFor: function(eventResults,needle) {
    var res = [];
    if (eventResults) {
        for (var i = 0; i<eventResults.length; i++) {
            for (var j = 0; j<eventResults[i].length; j++) {
                if (eventResults[i][j].key == needle) {
                    res.push(eventResults[i][j].value);
                }
            }
        }
    }
    return res;
},

scalarArrayToHashOfCounts: function(scalarArray) {
    var h = {};
    for (var i = 0; i<scalarArray.length; i++) {
        if (! h.hasOwnProperty(scalarArray[i])) {
            h[scalarArray[i]] = 0;
        }
        h[scalarArray[i]]++;
    }
},

A1isSupersetOfA2: function (aSuper,aSub) {    
    if (aSuper.length < aSub.length) { return false; }
    if ((aSuper == []) && (aSub == [])) { return true; }

    var aSuperHash = Game.util.scalarArrayToHashOfCounts(aSuper);
    var aSubHash = Game.util.scalarArrayToHashOfCounts(aSub);
    
    for (var k in aSubHash) {
        if (aSubHash.hasOwnProperty(k)) {
            if (! aSuperHash.hasOwnProperty(k)) { return false; }
            if (aSuperHash[k] < aSubHash[k]) { return false; }
        }
    }
    
    return true;
}

};