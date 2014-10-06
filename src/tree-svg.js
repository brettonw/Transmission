var TreeSvg = function () {
    var ts = Object.create(null);

    ts.render = function (nodeArray, parentField) {
        // create the raw SVG picture for display, assumes a width/height aspect ratio of 3/2
        var buffer = 0.15;
        var svg = '<div class="graph-svg-div">' +
                    '<svg class="graph-svg-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" ' +
                    'viewBox="' + ((7.0 * -buffer) / 4.0) + ', ' + (-buffer) + ', ' + (domain.x.displaySize + (3.0 * buffer)) + ', ' + (domain.y.displaySize + (2.0 * buffer)) + '" ' +
                    'preserveAspectRatio="xMidYMid meet"' +
                    '>' +
                    '<g transform="translate(0, 1), scale(1, -1)">';

        // make the plots
        var colors = ["blue", "red", "green", "orange", "purple"];
        for (var i = 0, count = graphDataArray.length; i < count; ++i) {
            svg += '<polyline fill="none" stroke="' + colors[i] + '" stroke-width="0.0075" points="';
            var graphData = graphDataArray[i];
            for (var j = 0, jcount = graphData.length; j < jcount; ++j) {
                var datum = domain.map(graphData[j]);
                svg += datum.x + ',' + datum.y + ' ';
            }
            svg += '" />';
        }

        // close the plot
        svg += "</svg></div><br>";
        return svg;
    };

    return ts;
}();
