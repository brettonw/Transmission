// a filter is an object that matches the following signature:
/*
var filter = function () {
    var f = Object.create(null);
    f.init = function (atom) {
        // set up any persistent parameters in the atom
    };

    f.test = function (a, b) {
        // return true if the disease would pass this test and transmit between two atoms
        return true;
    };

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

    return f;
};

var filterUseProphylactic = function (useProphylacticRate, prophylacticEfficacy) {
    var f = Object.create(null);
    f.init = function (a) {
        a.useProphylactic = (Math.random() < useProphylacticRate) ? 0.8 : 0.2
    };

    f.test = function (a, b) {
        // first determine if a prophylactic would be used. we use a
        // combination of the proclivities of the two atoms. return true if no
        // prophylactic is employed, or if the prophylactic fails
        var useProphylactic = Math.random() < ((a.useProphylactic + b.useProphylactic) / 2.0);
        return ((!useProphylactic) || (Math.random() >= prophylacticEfficacy));
    };

    return f;
};

