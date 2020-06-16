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

let liveUpdateSirPlot = false;
let liveUpdateTree = false;

let borderColorHighlight = "yellow";
let borderColorActive = "black";

// the population
let populationDimension;
let populationSize;
let population;
let infectiousCount = 0;
let infectedCount = 0;
let deadCount = 0;

// the stats to plot at the end of a run
let infectiousByDay = [];
let susceptibleByDay = [];
let removedByDay = [];
let deadByDay = [];

// the clock
let clock;
let day;
let clockDisplay;
let r0Display;
let mortalityRateDisplay;
let caseFatilityRateDisplay;
let paused;
let eventRate;
let eventsPerDiem;

let lastAtomA, lastAtomB;

let createPopulation = function () {
    population = [];

    // create all the individuals
    for (let id = 0; id < populationSize; ++id) {
        let atom = Object.create (atomPrototype);
        atom.id = id;
        atom.events = [];

        // loop over the filters
        for (let i = 0, count = filters.length; i < count; ++i) {
            filters[i].init(atom);
        }

        // assign the atom to the population
        population[id] = atom;
    }

    // now seed one of the individuals with disease
    let randomIndex = Math.floor (Math.random () * populationSize);
    let atom = population[randomIndex];
    atom.setState (disease.INFECTED, null);
    infectiousCount = infectedCount = 1;
    deadCount = 0;
    infectiousByDay = [];
    susceptibleByDay = [];
    removedByDay = [];
    deadByDay = [];
};

let conductEvent = function () {
    // randomly pair two individuals from the population
    let atomA = population[Math.floor(Math.random() * populationSize)];
    let atomB = population[Math.floor(Math.random() * populationSize)];
    while (!sampler.pair(atomA, atomB)) {
        atomB = population[Math.floor(Math.random() * populationSize)];
    }

    // loop over the filters
    let transmit = true;
    for (let i = 0, count = filters.length; transmit && (i < count) ; ++i) {
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

let makeSirdPlot = function () {
    let svg = PlotSvg.setLegendPosition (455, 390).setPlotPoints (false).multipleLine("SIRD", "Day", "Count", [susceptibleByDay, infectiousByDay, removedByDay, deadByDay], ["Susceptible", "Infectious", "Removed", "Dead"]);
    document.getElementById("sirPlot").innerHTML = svg;
};

let allInfected = function () {
    // complete the display
    makeSirdPlot();
    makeTree(true);

    // an event to say we're done
    simulatorFinished();
};

let startNewDay = function () {
    day = Math.floor(clock / eventsPerDiem);

    // sweep over the population to see if somebody becomes contagious or heals
    // or dies, or...
    let susceptible = 0;
    let removed = 0;
    for (let id = 0; id < populationSize; ++id) {
        let atom = population[id];
        let probability = ((day - atom.day()) - atom.state.daysMin) / (atom.state.daysMax - atom.state.daysMin);

        switch (atom.state.name) {
            case disease.INFECTED.name: {
                if (Math.random() < probability) {
                    // an infected individual might become clinical
                    atom.setState(disease.CLINICAL, null);
                }
            }
                break;
            case disease.CLINICAL.name: {
                if (Math.random() < probability) {
                    // a clinical individual might get better, and become convalescent
                    if (disease.CONVALESCENT.recurrence == 0) {
                        --infectiousCount;
                    }
                    atom.setState(disease.CONVALESCENT, null);
                } else if (Math.random() < atom.state.fatality) {
                    // or they might die
                    atom.setState(disease.DEAD, null);
                    ++deadCount;
                    --infectedCount;
                    --infectiousCount;
                }
            }
                break;
            case disease.CONVALESCENT.name: {
                if (Math.random() < probability) {
                    // a convalescent individual might return to healthy
                    --infectedCount;
                    atom.setState(disease.HEALTHY, null);
                } else if (Math.random() < atom.state.recurrence) {
                    // or a convalescent individual might have a recurrence
                    atom.setState(disease.CLINICAL, null);
                } else {
                    // otherwise just count the removed individual
                    removed += ((!atom.state.susceptible) ? 1 : 0);
                }
            }
                break;
        }

        // count the susceptible and removed atoms
        susceptible += (atom.state.susceptible ? 1 : 0);
    }

    // accumulate the stats
    infectiousByDay.push({ x: day, y: infectiousCount / populationSize });
    susceptibleByDay.push({ x: day, y: susceptible / populationSize });
    removedByDay.push({ x: day, y: removed / populationSize });
    deadByDay.push({ x: day, y: deadCount / populationSize });

    if (liveUpdateSirPlot) {
        makeSirdPlot();
    }
    makeTree(liveUpdateTree);

    clockDisplay.textContent = "Day " + day + " (Pairs: " + clock + ", Infected: " + infectedCount + "/" + populationSize + " = " + ((100.0 * infectedCount) / populationSize).toFixed(1) + "%, Dead: " + deadCount + ")";
    mortalityRateDisplay.textContent = "Mortality: " + (1000 * (deadCount / populationSize)).toFixed(2) + " / 1,000";
    caseFatilityRateDisplay.textContent = "CFR: " + (100 * (deadCount / infectedCount)).toFixed(2) + "%";
};

let tick = function (keepTicking) {
    // one time through is a day
    if (!paused) {
        if ((infectiousCount > 0) && (infectedCount < populationSize)) {
            startNewDay();
            for (let i = 0; i < eventsPerDiem; ++i) {
                ++clock;
                conductEvent ();
            }
            if (keepTicking) {
                setTimeout(function () { tick(true); }, 50);
            }
        } else {
            allInfected();
            paused = true;
        }
/*
        if ((infectiousCount > 0) && (infectedCount < populationSize)) {
            // see if it's a new day
            if ((clock % eventsPerDiem) == 0) {
                // do things that happen on a per day basis - we do this here to
                // avoid bias in events
                startNewDay();
            }

            // advance the clock
            ++clock;

            // conduct an event and loop back @ 20Hz if we are animating
            conductEvent();
            if (keepTicking) {
                setTimeout(function () { tick(true); }, animatePairs ? 50 : 1);
            }
        } else {
            allInfected();
            paused = true;
        }
 */
    }
};

let makeSvg = function () {
    // open the SVG and make the render port work like a mathematical system
    let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"-1.125 -1.125 2.25 2.25\" preserveAspectRatio=\"xMidYMid meet\">";
    //svg += "<g id=\"root\" transform=\"scale(1, -1)\">";

    // compute the placement parameters
    let blockSize = 0.75;
    let spacing = 2.0 / (populationDimension + 1);
    let size = spacing * blockSize;
    let offset = -size / 2.0;

    // loop over the whole population to place each individual in the world
    for (let id = 0; id < populationSize; ++id) {
        // get the individual from the population
        let atom = population[id];

        // compute the position of the block
        let xy = atom.map();
        let x = -1 + ((xy.x + 1) * spacing) + offset;
        let y = -1 + ((xy.y + 1) * spacing) + offset;

        // loop over the filters
        for (let i = 0, count = filters.length; i < count ; ++i) {
            svg += filters[i].render(atom, x, y, size, size);
        }
    }
    //svg += "</g>";

    // add the clock
    svg += "<text id=\"clockDisplay\" x=\"-1.1\" y=\"-1.05\" font-family=\"Verdana\" font-size=\"0.0625\" fill=\"#404040\">Ready</text>";
    svg += "<text id=\"r0Display\" x=\"-1.1\" y=\"1.075\" font-family=\"Verdana\" font-size=\"0.05\" fill=\"#404040\">R: -</text>";
    svg += "<text id=\"mortalityRateDisplay\" x=\"-0.33\" y=\"1.075\" font-family=\"Verdana\" font-size=\"0.05\" fill=\"#404040\">Mortality: - / 100,000</text>";
    svg += "<text id=\"caseFatilityRateDisplay\" x=\"0.75\" y=\"1.075\" font-family=\"Verdana\" font-size=\"0.05\" fill=\"#404040\">CFR: - %</text>";

    // close the SVG
    svg += "</svg>";
    return svg;
};

let linkSvg = function () {
    for (let id = 0; id < populationSize; ++id) {
        let atom = population[id];
        let link = document.getElementById ("rect" + id);
        atom.link = link;
    }
    clockDisplay = document.getElementById ("clockDisplay");
    r0Display = document.getElementById ("r0Display");
    mortalityRateDisplay = document.getElementById ("mortalityRateDisplay");
    caseFatilityRateDisplay = document.getElementById ("caseFatilityRateDisplay");

    // create a dummy atom to clear status on so that we can remove an "if"
    // statement from the inner loop (this object will be abandoned very early)
    lastAtomA = {};
    lastAtomA.link = {};
    lastAtomA.link.style = {};
    lastAtomB = lastAtomA;
}

let toggleRun = function () {
    // pause and resume animation
    if (paused) {
        if ((infectiousCount == 0) || (infectedCount == populationSize)) {
            init();
        } else {
            paused = false;
            tick(true);
        }
    } else {
        paused = true;
    }
    return paused;
};

let singleStep = function () {
    // pause and resume animation
    if (paused) {
        paused = false;
        tick(false);
        paused = true;
    } else {
        // do nothing
    }
    return paused;
};

let init = function () {
    // reset the clock
    clock = day = 0;
    paused = true;

    createPopulation();
    let display = makeSvg();
    document.getElementById("display").innerHTML = display;
    linkSvg();

    // complete the display
    makeSirdPlot();
    makeTree(true);
};
