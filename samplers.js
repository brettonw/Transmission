// a sampler is an object that matches the following signature:
/*
var sampler = function () {
    var s = Object.create(null);
    s.pair = function (a, b) {
        // return true if the sampler should affect this pairing
        return true;
    };
    return s;
};
*/

var randomSampler = function () {
    var s = Object.create(null);
    s.pair = function (a, b) {
        return (a.id != b.id);
    };
    return s;
};

var strictLocalManhattenSampler = function (width) {
    var s = Object.create(null);
    s.pair = function (a, b) {
        if (a.id != b.id) {
            // compute the manhatten distance between the atoms
            var axy = a.map();
            var bxy = b.map();
            var distance = Math.abs(axy.x - bxy.x) + Math.abs(axy.y - bxy.y);
            return distance <= width;
        }
        return false;
    };
    return s;
};

var localManhattenSampler = function (width) {
    var s = Object.create(null);
    s.pair = function (a, b) {
        if (a.id != b.id) {
            // compute the manhatten distance between the atoms
            var axy = a.map();
            var bxy = b.map();
            var distance = Math.abs(axy.x - bxy.x) + Math.abs(axy.y - bxy.y);

            // compute a likelihood these two candidates should pair based on a
            // width bias that scales down on a cubic
            var baseProbability = width / distance;
            var probability = baseProbability * baseProbability * baseProbability;
            var roll = Math.random();
            return roll < probability;
        }
        return false;
    };
    return s;
};
