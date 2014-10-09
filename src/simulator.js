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

var animatePairs = false;
var liveUpdateGraph = false;
var liveUpdateTree = false;

var borderColorHighlight = "#FFFF00";
var borderColorActive = "#808080";

// the population
var populationDimension;
var populationSize;
var population;
var infectiousCount = 0;
var infectedCount = 0;

// the stats to plot at the end of a run
var infectiousByDay = [];
var infectedByDay = [];

// the clock
var clock;
var day;
var clockDisplay;
var paused;
var eventRate;
var eventsPerDiem;

var lastAtomA, lastAtomB;

var createPopulation = function () {
    population = [];

    // create all the individuals
    for (var id = 0; id < populationSize; ++id) {
        var atom = Object.create (atomPrototype);
        atom.id = id;
        atom.events = [];


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
    atom.setState (disease.INFECTED, null);
    infectiousCount = infectedCount = 1;
    infectiousByDay = [];
    infectedByDay = [];
};

var conductEvent = function () {
    // clear the last event info by denoting those atoms as "active"
    lastAtomA.link.style.stroke = borderColorActive;
    lastAtomB.link.style.stroke = borderColorActive;

    // randomly pair two individuals from the population
    var atomA = population[Math.floor(Math.random() * populationSize)];
    var atomB = population[Math.floor(Math.random() * populationSize)];
    while (!sampler.pair(atomA, atomB)) {
        atomB = population[Math.floor(Math.random() * populationSize)];
    }

    // highlight this pairing
    if (animatePairs) {
        atomA.link.style.stroke = borderColorHighlight;
        atomB.link.style.stroke = borderColorHighlight;
    }

    // loop over the filters
    var transmit = true;
    for (var i = 0, count = filters.length; transmit && (i < count) ; ++i) {
        transmit = filters[i].test(atomA, atomB);
    }

    // if the transmit event succeeds, do the deed
    if (transmit) {
        atomA.infectBy(atomB);
        atomB.infectBy(atomA);
        ++infectiousCount;
        ++infectedCount;
    }

    // save this information for the next event
    lastAtomA = atomA;
    lastAtomB = atomB;
};

var makeGraph = function () {
    var svg = PlotSvg.multipleLine("Infected Count vs. Day", "Day", "Infected (n)", [infectiousByDay, infectedByDay]);
    document.getElementById("chart").innerHTML = svg;
};

var makeTree = function () {
    // copy the population array, since we want to sort it
    var data = new Array(populationSize);
    for (var i = 0; i < populationSize; ++i) {
        data[i] = population[i];
    }

    // helper function to retrieve an infection event
    var getInfectionEvent = function (atom) {
        if ((atom.events.length > 0) &&
            (atom.events[0].state.name == "INFECTED") &&
            ("by" in atom.events[0])) {
            return atom.events[0];
        }
        return null;
    };

    // sort the population by the infection date
    data.sort(function (a, b) {
        var aEvent = getInfectionEvent(a);
        var bEvent = getInfectionEvent(b);
        if (aEvent != null) {
            if (bEvent != null) {
                return aEvent.day - bEvent.day;
            } else {
                return 1;
            }
        } else if (bEvent != null) {
            // already know that a is null
            return -1;
        } else {
            return 0;
        }
    });

    // sweep the population to build the infection tree
    for (var i = 0, count = data.length; i < count; ++i) {
        var atom = data[i];
        var infectionEvent = getInfectionEvent(atom);
        atom.parentId = (infectionEvent != null) ? infectionEvent.by.id : null;
    }

    // get the root of the tree
    var root = TreeSvg.extractTreeFromParentField(data, "id", "parentId");
    var svg = TreeSvg.render(root);
    document.getElementById("tree").innerHTML = svg;
};

var allInfected = function () {
    // clear the final highlight
    lastAtomA.link.style.stroke = borderColorActive;
    lastAtomB.link.style.stroke = borderColorActive;

    // an event to say we're done
    simulatorFinished();
};

var startNewDay = function () {
    day = Math.floor(clock / eventsPerDiem);

    // sweep over the population to see if somebody becomes contagious or heals
    // or dies, or...
    for (var id = 0; id < populationSize; ++id) {
        var atom = population[id];

        switch (atom.state.name) {
            case disease.INFECTED.name: {
                var probability = ((day - atom.day()) - atom.state.daysMin) / (atom.state.daysMax - atom.state.daysMin);
                if (Math.random() < probability) {
                    // an infected individual might become clinical
                    atom.setState(disease.CLINICAL, null);
                }
            }
                break;
            case disease.CLINICAL.name: {
                var probability = ((day - atom.day()) - atom.state.daysMin) / (atom.state.daysMax - atom.state.daysMin);
                if (Math.random() < probability) {
                    // a clinical individual might get better, and become convalescent
                    if (disease.CONVALESCENT.recurrence == 0) {
                        --infectiousCount;
                    }
                    atom.setState(disease.CONVALESCENT, null);
                }
            }
                break;
            case disease.CONVALESCENT.name: {
                var probability = ((day - atom.day()) - atom.state.daysMin) / (atom.state.daysMax - atom.state.daysMin);
                if (Math.random() < probability) {
                    // a convalescent individual might return to healthy
                    --infectedCount;
                    atom.setState(disease.HEALTHY, null);
                } else if (Math.random() < atom.state.recurrence) {
                    // or a convalescent individual might have a recurrence
                    atom.setState(disease.CLINICAL, null);
                }
            }
                break;
        }
    }

    // accumulate the stats
    infectedByDay.push({ x: day, y: infectedCount });
    infectiousByDay.push({ x: day, y: infectiousCount });
    if (liveUpdateGraph && (day > 2) && (infectedCount > 2)) {
        makeGraph();
    }
    if (liveUpdateTree) {
        makeTree();
    }
};

var tick = function () {
    if (!paused) {
        if ((infectiousCount > 0) && (infectedCount < populationSize)) {
            // see if it's a new day
            if ((clock % eventsPerDiem) == 0) {
                // do things that happen on a per day basis - we do this here to
                // avoid bias in events
                startNewDay();
            }

            // advance the clock
            ++clock;

            // conduct an event and loop back @ 30Hz
            conductEvent();
            setTimeout(tick, animatePairs ? 50 : 1);
        } else {
            allInfected();
            paused = true;
        }
    }
    clockDisplay.textContent = "Day " + day + " (" + clock + ", " + infectedCount + "/" + populationSize + " = " + ((100.0 * infectedCount) / populationSize).toFixed(1) + "%)";
};

var makeSvg = function () {
    // open the SVG and make the render port work like a mathematical system
    var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"-1.125 -1.125 2.25 2.25\" preserveAspectRatio=\"xMidYMid meet\">";
    svg += "<g id=\"root\" transform=\"scale(1, -1)\">";

    // compute the placement parameters
    var blockSize = 0.75;
    var spacing = 2.0 / (populationDimension + 1);
    var size = spacing * blockSize;
    var offset = -size / 2.0;

    // loop over the whole population to place each individual in the world
    for (var id = 0; id < populationSize; ++id) {
        // get the individual from the population
        var atom = population[id];

        // compute the position of the block
        var xy = atom.map();
        var x = -1 + ((xy.x + 1) * spacing) + offset;
        var y = -1 + ((xy.y + 1) * spacing) + offset;

        // loop over the filters
        for (var i = 0, count = filters.length; i < count ; ++i) {
            svg += filters[i].render(atom, x, y, size, size);
        }
    }
    svg += "</g>";

    // add the clock
    svg += "<text id=\"clockDisplay\" x=\"-1\" y=\"-1\" font-family=\"Verdana\" font-size=\"0.075\" fill=\"#404040\">Ready</text>";

    // close the SVG
    svg += "</svg>";
    return svg;
};

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

var toggleRun = function () {
    // pause and resume animation
    if (paused) {
        if ((infectiousCount == 0) || (infectedCount == populationSize)) {
            init();
        } else {
            paused = false;
            tick();
        }
    } else {
        paused = true;
    }
    return paused;
};

var init = function () {
    // reset the clock
    clock = day = 0;
    paused = true;

    createPopulation();
    var display = makeSvg();
    document.getElementById("display").innerHTML = display;
    linkSvg();
};
