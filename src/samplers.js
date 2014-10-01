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

var normL0 = function (a, b) {
    if (a.id != b.id) {
        // compute the manhatten distance between the atoms
        var axy = a.map();
        var bxy = b.map();
        var distance = Math.abs(axy.x - bxy.x) + Math.abs(axy.y - bxy.y);
        return distance;
    }
    return Infinity;
};

var normL1 = function (a, b) {
    if (a.id != b.id) {
        // compute the pythagorean distance between the atoms
        var axy = a.map();
        var bxy = b.map();
        var d = { x: axy.x - bxy.x, y: axy.y - bxy.y };
        var distance = Math.sqrt ((d.x * d.x) + (d.y * d.y));
        return distance;
    }
    return Infinity;
};

var strictSampler = function (width, normFunction) {
    var s = Object.create(null);
    s.pair = function (a, b) {
        var distance = normFunction(a, b);
        return distance <= width;
    };
    return s;
};

var strictL0Sampler = function (width) {
    var strict = strictSampler(width, normL0);
    var s = Object.create(null);
    s.pair = function (a, b) {
        return strict.pair(a, b);
    };
    return s;
};

var strictL1Sampler = function (width) {
    var strict = strictSampler(width, normL1);
    var s = Object.create(null);
    s.pair = function (a, b) {
        return strict.pair(a, b);
    };
    return s;
};

var probabilitySampler = function (width, normFunction) {
    var s = Object.create(null);
    s.pair = function (a, b) {
        if (a.id != b.id) {
            var distance = normFunction(a, b);

            // compute a likelihood these two candidates should pair based on a
            // width bias that scales down on a power ratio
            var baseProbability = width / distance;
            var probability = Math.pow (baseProbability, 4);
            var roll = Math.random();
            return roll < probability;
        }
        return false;
    };
    return s;
};

var probabilityL0Sampler = function (width) {
    var probability = probabilitySampler(width, normL0);
    var s = Object.create(null);
    s.pair = function (a, b) {
        return probability.pair(a, b);
    };
    return s;
};

var probabilityL1Sampler = function (width) {
    var probability = probabilitySampler(width, normL1);
    var s = Object.create(null);
    s.pair = function (a, b) {
        return probability.pair(a, b);
    };
    return s;
};

var knownPartnerBiasSampler = function (count) {
    var s = Object.create(null);
    s.pair = function (a, b) {
        //if ("partners" in a)
        return true;
    };
    return s;
}

var samplers = {
    "Random": { order: 0, sampler: randomSampler ()},
    "Strictly Local (L0, w=1.0)": { order: 1, sampler: strictL0Sampler (1.0) },
    "Strictly Local (L0, w=2.0)": { order: 2, sampler: strictL0Sampler (2.0) },
    "Strictly Local (L1, w=1.0)": { order: 3, sampler: strictL1Sampler (1.0) },
    "Strictly Local (L1, w=1.5)": { order: 4, sampler: strictL1Sampler (1.5) },
    "Strictly Local (L1, w=2.0)": { order: 5, sampler: strictL1Sampler (2.0) },
    "Probably Local (L0, w=1.0)": { order: 6, sampler: probabilityL0Sampler (1.0) },
    "Probably Local (L1, w=1.4)": { order: 7, sampler: probabilityL1Sampler (1.4) },
    "Probably Local (L1, w=2.0)": { order: 7, sampler: probabilityL1Sampler (2.0) },
    "Probably Local (L1, w=3.0)": { order: 7, sampler: probabilityL1Sampler (3.0) }
};

var sampler;