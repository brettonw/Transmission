var globalId = 0;
var index = [];
var makeContainer = function (node, parent, expanded) {
    var container = {
        "node": node,
        "parent": parent,
        "children": [],
        "expanded": expanded,
        "id": globalId++
    };
    if (parent != null) {
        parent.children.push(container);
    }
    index[container.id] = container;
    return container;
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
    var helper = TreeSvg.getDefaultHelper ();
    helper.getId = function (container) { return container.node.id; };
    helper.getColor = function (container) { return container.node.state.color; };
    var svg = TreeSvg.renderWithHelper(root, helper);
    document.getElementById("tree").innerHTML = svg;
};


