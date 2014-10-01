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
    setValue("eventRateRange", 2.0);
    setValue("diseaseSelect", "Perfect");
    setValue("samplerSelect", "Random");
    setValue("prophylacticUseRateRange", 0);
    setValue("prophylacticEfficacyRange", 95);
    setValue("prophylacticBlendBiasRange", 60);
    document.getElementById("animatePairsCheckbox").checked = animatePairs = false;

    loaded = true;

    // synchronize the UI and the simulation
    synchUi ();
}

var synchUi = function () {
    if (loaded == true) {
        populationWidth = new Number (document.getElementById("populationWidthRange").value);
        populationHeight = new Number (document.getElementById("populationHeightRange").value);
        populationSize = populationWidth * populationHeight;
        eventRate = new Number (document.getElementById("eventRateRange").value);
        eventsPerDiem = Math.floor(((populationSize * eventRate) / 7.0) + 0.5);

        disease = diseases[document.getElementById("diseaseSelect").value];

        // clear out the filters
        filters = [];
        filters.push(filterCanTransmit(disease));

        // configure prophylactics
        var useRate = new Number (document.getElementById("prophylacticUseRateRange").value) / 100.0;
        if (useRate > 0) {
            var efficacy = new Number (document.getElementById("prophylacticEfficacyRange").value) / 100.0;
            var blendBias = new Number (document.getElementById("prophylacticBlendBiasRange").value) / 100.0;
            filters.push(filterUseProphylactic(useRate, efficacy, 0.95, 0.0, blendBias));
        }

        sampler = samplers.make(document.getElementById("samplerSelect").value);
        main();
    }
}

var populationWidthRangeInput = function (range) {
    document.getElementById("populationWidthDisplay").innerHTML = range.value;
}

var populationHeightRangeInput = function (range) {
    document.getElementById("populationHeightDisplay").innerHTML = range.value;
}

var eventRateRangeInput = function (range) {
    document.getElementById("eventRateDisplay").innerHTML = (new Number (range.value)).toPrecision (3);
}

var prophylacticUseRateRangeInput = function (range) {
    document.getElementById("prophylacticUseRateDisplay").innerHTML = range.value + "%";
}

var prophylacticEfficacyRangeInput = function (range) {
    document.getElementById("prophylacticEfficacyDisplay").innerHTML = range.value + "%";
}

var prophylacticBlendBiasRangeInput = function (range) {
    document.getElementById("prophylacticBlendBiasDisplay").innerHTML = range.value + "%";
}

var animatePairsCheckboxChanged = function (checkbox) {
    animatePairs = checkbox.checked;
}

