// a filter is an object that matches the following signature:
/*
var filter = function () {
    var f = Object.create(null);
    f.init = function (atom) {
        // set up any persistent parameters in the atom
    };

    f.test = function (atomA, atomB) {
        // return true if the disease would pass this test and transmit between two atoms
        return true;
    };

    f.render = function (atom, x, y, width, height) {
        // return an SVG rendering command within the box provided
        return "<rect ... />";
    }

    return f;
};
*/

var filterCanTransmit = function (states) {
    var f = Object.create(null);
    f.init = function (a) {
        a.state = states.HEALTHY;
    };

    f.test = function (a, b) {
        // if the pairing is susceptible to a transfer event, return true if
        // a roll of the dice results in a transfer, otherwise false
        return ((a.state.susceptible && (b.state.contagious > 0.0)) || (b.state.susceptible && (a.state.contagious > 0.0))) ?
            (Math.random() < (a.state.contagious + b.state.contagious)) :
            false;
    };

    f.render = function (atom, x, y, width, height) {
        // return an SVG rendering command within the box provided
        var rect = "";
        rect += "<rect id=\"rect" + atom.id + "\"";
        rect += " x=\"" + x + "\" y=\"" + y + "\"";
        rect += " width=\"" + width + "\" height=\"" + height + "\"";
        rect += " fill=\"" + atom.state.color + "\"";
        rect += " stroke=\"black\" stroke-width=\"0.008\" />"
        return rect;
    }

    return f;
};

var filterUseProphylactic = function (useRate, efficacy, userProbability, nonUserProbability, blendBias) {
    var f = Object.create(null);
    f.init = function (a) {
        a.useProphylactic = (Math.random() < useRate) ? userProbability : nonUserProbability;
    };

    f.test = function (a, b) {
        // first determine if a prophylactic would be used. we use a
        // combination of the proclivities of the two atoms.

        // swap the two atoms if b is more likely to use prophylactics than a
        if (b.useProphylactic > a.useProphylactic) {
            var c = a; a = b; b = c;
        }
        var useProbability = ((a.useProphylactic * blendBias) + (b.useProphylactic * (1.0 - blendBias)));

        // return true if no prophylactic is employed, or if the prophylactic fails
        return ((Math.random() > useProbability) || (Math.random() >= efficacy));
    };

    f.render = function (atom, x, y, width, height) {
        var makeGray = function (percent) {
            var value = Math.floor(percent * 255);
            var alphaValue = 1.0 - percent;
            return "rgba(" + value + ", " + value + ", " + value + ", " + alphaValue + ")";
        }

        // return an SVG rendering command within the box provided
        var rect = "";
        rect += "<rect x=\"" + (x + (width / 3.0)) + "\" y=\"" + (y + (height / 3.0)) + "\"";
        rect += " width=\"" + (width / 3.0) + "\" height=\"" + (height / 3.0) + "\"";
        rect += " fill=\"" + makeGray(1.0 - (atom.useProphylactic * ((efficacy *0.667) + 0.333))) + "\"";
        rect += " stroke=\"none\" />"
        return rect;
    }

    return f;
};

var filters = [];
