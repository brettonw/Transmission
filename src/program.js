// This program is intended to provide a foundation for simulating disease
// transfer in a population with a variety of different factors, and across a
// range of strategies for preventing disease transfer

// factors:
// - Activity level (some people will have more interactions than others, maybe
//   males in general?

// We start with a population of unspecified individuals, and run a clock. At
// each tick of the clock we conduct an event. An event represents an
// opportunity for a disease transfer to occur. The population is seeded to
// provide a source for the disease.

// events model transmission rates, affected by the various strategies

var animatePairs;

var borderColorHighlight = "#FFFF00";
var borderColorActive = "#808080";

// the population
var populationWidth;
var populationHeight;
var populationSize;
var population;
var infectedCount;
var totalInfectedCount;

// the clock
var clock;
var day;
var clockDisplay;
var paused;
var eventRate;
var eventsPerDiem;

var lastAtomA, lastAtomB;

// set up prophylactics
/*
var useProphylacticRate = 0.2;
var prophylacticEfficacy = 0.8;
//filters.push(filterUseProphylactic(useProphylacticRate, prophylacticEfficacy));
filters.push(filterUseProphylactic(0, 0));
*/

var atomPrototype = Object.create(null);
atomPrototype.map = function () {
    return {
        x: this.id % populationWidth,
        y: Math.floor(this.id / populationWidth)
    };
};

var createPopulation = function () {
    population = [];

    // create all the individuals
    for (var id = 0; id < populationSize; ++id) {
        var atom = Object.create (atomPrototype);
        atom.id = id;
        atom.day = -1;

        // loop over the filters
        for (var i = 0, count = filters.length; i < count; ++i) {
            filters[i].init(atom);
        }

        // assign the atom to the population
        population[id] = atom;
    }

    // now seed one of the individuals with disease
    var randomIndex = Math.floor (Math.random () * populationSize);
    var atom = population[randomIndex];
    atom.state = disease.INFECTED;
    atom.day = day;
    infectedCount = totalInfectedCount = 1;
};

var conductEvent = function () {
    // clear the last event info by denoting those atoms as "active"
    lastAtomA.link.style.stroke = borderColorActive;
    lastAtomB.link.style.stroke = borderColorActive;

    // randomly pair two individuals from the population
    var atomA = population[Math.floor(Math.random() * populationSize)];
    var atomB = population[Math.floor(Math.random() * populationSize)];
    while (! sampler.pair(atomA, atomB)) {
        atomB = population[Math.floor(Math.random() * populationSize)];
    }

    // highlight this pairing
    if (animatePairs) {
        atomA.link.style.stroke = borderColorHighlight;
        atomB.link.style.stroke = borderColorHighlight;
    }

    // loop over the filters
    var transmit = true;
    for (var i = 0, count = filters.length; transmit && (i < count); ++i) {
        transmit = filters[i].test(atomA, atomB);
    }

    // if the transmit event succeeds, do the deed
    if (transmit) {
        var infectAtom = function (atom) {
            if (atom.state == disease.HEALTHY) {
                ++infectedCount;
                ++totalInfectedCount;
                atom.state = disease.INFECTED;
                atom.day = day;
                atom.link.style.fill = atom.state.color;
            }
        };

        infectAtom(atomA);
        infectAtom(atomB);
    }

    // save this information for the next event
    lastAtomA = atomA;
    lastAtomB = atomB;
}

var allInfected = function () {
    lastAtomA.link.style.stroke = borderColorActive;
    lastAtomB.link.style.stroke = borderColorActive;
}

var startNewDay = function () {
    day = Math.floor (clock / eventsPerDiem);

    // sweep over the population to see if somebody becomes contagious or heals
    // or dies, or...
    for (var id = 0; id < populationSize; ++id) {
        var atom = population[id];

        switch (atom.state.name) {
            case disease.INFECTED.name: {
                var probability = ((day - atom.day) - atom.state.daysMin) / (atom.state.daysMax - atom.state.daysMin);
                if (Math.random () < probability) {
                    atom.state = disease.CLINICAL;
                    atom.day = day;
                    atom.link.style.fill = atom.state.color;
                }
            }
            break;
            case disease.CLINICAL.name: {
                var probability = ((day - atom.day) - atom.state.daysMin) / (atom.state.daysMax - atom.state.daysMin);
                if (Math.random () < probability) {
                    --infectedCount;
                    atom.state = disease.CONVALESCENT;
                    atom.day = day;
                    atom.link.style.fill = atom.state.color;
                }
            }
            break;
        }
    }
}

var tick = function () {
    if (! paused) {
        if ((infectedCount > 0) && (infectedCount < populationSize)) {
            // see if it's a new day
            if ((clock % eventsPerDiem) == 0) {
                // do things that happen on a per day basis - we do this here to
                // avoid bias in events
                startNewDay ();
            }

            // advance the clock
            ++clock;

            // conduct an event and loop back @ 30Hz
            conductEvent();
            setTimeout(tick, animatePairs ? 33 : 1);
        } else {
            allInfected ();
            paused = true;
        }
    }
    clockDisplay.textContent = "Day " + day + " (" + clock + ", " + totalInfectedCount + "/" + populationSize + ")";
}

var click = function () {
    // pause and resume animation
    if (paused) {
        if ((infectedCount == 0) || (infectedCount == populationSize)) {
			main ();
		} else {
			paused = false;
			tick ();
		}
    } else {
        paused = true;
    }
}

var makeGray = function(percent) {
    var value = Math.floor(percent * 255);
    var alphaValue = 1.0 - percent;
    return "rgba(" + value + ", " + value + ", " + value + ", " + alphaValue + ")";
}

var makeSvg = function () {
    // open the SVG and make the render port work like a mathematical system
    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"-1.125 -1.125 2.25 2.25\" preserveAspectRatio=\"xMidYMid meet\" onclick=\"click()\">";
    svg += "<g id=\"root\" transform=\"scale(1, -1)\">";

    // compute the placement parameters
    var blockSize = 0.75;
    var horizontalSpacing = 2.0 / (populationWidth + 1);
    var horizontalSize = horizontalSpacing * blockSize;
    var horizontalOffset = -horizontalSize / 2.0;
    var verticalSpacing = 2.0 / (populationHeight + 1);
    var verticalSize = verticalSpacing * blockSize;
    var verticalOffset = -verticalSize / 2.0;

    // loop over the whole population to place each individual in the world
    for (var id = 0; id < populationSize; ++id) {
        // get the individual from the population
        var atom = population[id];

        // compute the position of the block
        var xy = atom.map();
        var x = -1 + ((xy.x + 1) * horizontalSpacing) + horizontalOffset;
        var y = -1 + ((xy.y + 1) * verticalSpacing) + verticalOffset;

        // enumerate the block
        var rect = "";
        rect += "<rect id=\"rect" + id + "\"";
        rect += " x=\"" + x + "\" y=\"" + y + "\"";
        rect += " width=\"" + horizontalSize + "\" height=\"" + verticalSize + "\"";
        rect += " fill=\"" + atom.state.color + "\"";
        rect += " stroke=\"black\" stroke-width=\"0.005\" />"
        rect += "<rect x=\"" + (x + (horizontalSize / 3.0)) + "\" y=\"" + (y + (verticalSize / 3.0)) + "\"";
        rect += " width=\"" + (horizontalSize / 3.0) + "\" height=\"" + (verticalSize / 3.0) + "\"";
        rect += " fill=\"" + makeGray (1.0 - atom.useProphylactic) + "\"";
        rect += " stroke=\"none\" />"
        svg += rect;
    }
    svg += "</g>";

    // add the clock
    svg += "<text id=\"clockDisplay\" x=\"-1\" y=\"-1\" font-family=\"Verdana\" font-size=\"0.075\" fill=\"#404040\">Click to start</text>";

    // close the SVG
    svg += "</svg>";
    return svg;
}

var linkSvg = function () {
    for (var id = 0; id < populationSize; ++id) {
        var atom = population[id];
        var link = document.getElementById ("rect" + id);
        atom.link = link;
    }
    clockDisplay = document.getElementById ("clockDisplay");

    // create a dummy atom to clear status on so that we can remove an "if"
    // statement from the inner loop (this object will be abandoned very early)
    lastAtomA = {};
    lastAtomA.link = {};
    lastAtomA.link.style = {};
    lastAtomB = lastAtomA;
}

var main = function () {
    // reset the clock
    clock = day = 0;
    infectedCount = totalInfectedCount = 0;
    paused = true;

    createPopulation ();
    var display = makeSvg ();
    document.getElementById ("display").innerHTML = display;
    linkSvg ();
}
