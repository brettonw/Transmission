var treeRoot;

var drawTree = function () {
    var adapter = TreeSvg.getDefaultAdapter();
    adapter.getTitle = function (container) { return "" + container.node.id; };
    adapter.getColor = function (container) { return container.node.state.color; };
    var svg = TreeSvg.renderSvg(treeRoot, "Linear-Vertical", adapter);
    document.getElementById("tree").innerHTML = svg;
}

TreeSvgHelper.setClickHandler(function (clickEvent) { drawTree(); });
TreeSvg.setNodeRadius(6.0);

var makeTree = function (drawIt) {
    // copy the population array, since we want to sort it
    var data = new Array(populationSize);
    for (var i = 0; i < populationSize; ++i) {
        data[i] = population[i];
        data[i].r0 = 0;
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
            return a.id - b.id;
        }
    });

    // sweep the population to build the infection tree
    for (var i = 0; i < populationSize; ++i) {
        var atom = data[i];
        var infectionEvent = getInfectionEvent(atom);
        if (infectionEvent != null) {
            atom.parentId = infectionEvent.by.id;
            infectionEvent.by.r0++;
        } else {
            atom.parentId = null;
        }
    }

    // compute the reproductive statistics
    var sum = 0;
    var min = populationSize;
    var max = 0;
    var count = 0;
    for (var i = 0; i < populationSize; ++i) {
        var atom = data[i];
        //if (atom.state.name != disease.HEALTHY.name) {
        var r0 = atom.r0;
        if (r0 > 0) {
            min = Math.min(r0, min);
            max = Math.max(r0, max);
            sum += r0;
            count++;
        }
    }
    var avg = (count > 0) ? (sum / count) : 0;
    var median = (min + max) / 2.0;
    //console.log("R0: avg (" + avg + "), min (" + min + "), max (" + max + "), med (" + median + ")");
    r0Display.textContent = "R: " + avg.toFixed(3);

    // get the root of the tree
    if (drawIt === true) {
        TreeSvgHelper.index = [];
        treeRoot = TreeSvgHelper.extractTreeFromParentField(data, "id", "parentId");
        drawTree();
    }
};


