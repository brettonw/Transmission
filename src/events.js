var loaded = false;

var onLoad = function () {
    var addSelectOption = function (select, name) {
        var option = document.createElement("option");
        option.text = name;
        select.add(option);
    };

    // first, build the disease list
    var diseaseSelect = document.getElementById("diseaseSelect");
    var diseaseNames = Object.keys(diseases).sort();
    for (var i = 0, count = diseaseNames.length; i < count; ++i) {
        var diseaseName = diseaseNames[i];
        addSelectOption(diseaseSelect, diseaseName);
    }

    // second, build the pairing strategy list
    var samplerSelect = document.getElementById("samplerSelect");
    var samplerNames = Object.keys(samplers).sort(function (a, b) { return a.order - b.order; });
    for (var i = 0, count = samplerNames.length; i < count; ++i) {
        var samplerName = samplerNames[i];
        if (samplers[samplerName].hasOwnProperty("order")) {
            addSelectOption(samplerSelect, samplerName);
        }
    }

    // set default values, do this on the UI elements so they propagate to the
    // actual simulation elements
    var setValue = function (name, value) {
        var element = document.getElementById(name);
        element.value = value;
        element.onchange();
        if (element.oninput != null) {
            element.oninput();
        }
    };
    setValue("populationWidthRange", 10);
    setValue("populationHeightRange", 10);
    setValue("diseaseSelect", "perfect");
    setValue("samplerSelect", "Random");
    setValue("eventRateRange", 2.0);
    document.getElementById("animatePairsCheckbox").checked = animatePairs = false;

    loaded = true;

    // synchronize the UI and the simulation
    synchUi ();
}

var synchUi = function () {
    if (loaded == true) {
        main();
    }
}

var updatePopulationSize = function () {
    populationSize = populationWidth * populationHeight;
    eventsPerDiem = Math.floor(((populationSize * eventRate) / 7.0) + 0.5);
    synchUi();
}

var populationWidthRangeChanged = function (range) {
    populationWidth = new Number (range.value);
    updatePopulationSize ();
}

var populationWidthRangeInput = function (range) {
    document.getElementById("populationWidthDisplay").innerHTML = range.value;
}

var populationHeightRangeChanged = function (range) {
    populationHeight = new Number (range.value);
    updatePopulationSize ();
}

var populationHeightRangeInput = function (range) {
    document.getElementById("populationHeightDisplay").innerHTML = range.value;
}

var animatePairsCheckboxChanged = function (checkbox) {
    animatePairs = checkbox.checked;
}

var eventRateRangeChanged = function (range) {
    eventRate = new Number (range.value);
    updatePopulationSize ();
}

var eventRateRangeInput = function (range) {
    document.getElementById("eventRateDisplay").innerHTML = (new Number (range.value)).toPrecision (3);
}

var diseaseSelectChanged = function (select) {
    // change the disease
    disease = diseases[select.value];

    // clear out the filters
    filters = [];
    filters.push(filterCanTransmit(disease));

    // XXX temporarily use bogus prophylactics
    //filters.push(filterUseProphylactic(0, 0));

    synchUi();
}

var samplerSelectChanged = function (select) {
    // change the sampler
    sampler = samplers.make(select.value);

    synchUi();
}
