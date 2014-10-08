var TreeSvg = function () {
    var ts = Object.create(null);

    ts.extractTreeFromParentField = function (nodes, idField, parentIdField) {
        // internal function to get a node container from the id
        var nodesById = Object.create(null);
        var getContainerById = function (id, node) {
            if (!(id in nodesById)) {
                nodesById[id] = { "children": [] };
            }
            var container = nodesById[id];
            if (node != null) {
                container.node = node;
            }
            return container;
        };

        // build a hash of nodes by id, with children, filling in the children
        // as we walk the tree. assume the nodes are sorted in the desired order
        var root;
        for (var i = 0, count = nodes.length; i < count; ++i) {
            var node = nodes[i];
            var id = node[idField];
            var container = getContainerById(id, node);
            var parentId = node[parentIdField];
            if (parentId != null) {
                var parentContainer = getContainerById(parentId, null);
                parentContainer.children.push(container);
            } else {
                root = container;
            }
        }

        // return the finished result
        return root;
    };

    ts.sweepAndCount = function (root) {
        var rows = [];
        var width = 0;
        var recursiveSweepAndCount = function (rowIndex, container) {
            // add a row if there isn't one
            if (!(rowIndex in rows)) {
                rows[rowIndex] = [];
            }

            // add this node to the current row, and update the container with 
            // the counter
            container.rowIndex = rowIndex;
            rows[rowIndex].push(container);
            width = Math.max(rows[rowIndex].length, width);

            // recur into the children
            var nextRowIndex = rowIndex + 1;
            for (var i = 0, count = container.children.length; i < count; ++i) {
                var child = container.children[i];
                recursiveSweepAndCount(nextRowIndex, child);
            }
        };
        recursiveSweepAndCount(0, root);
        return {
            "root": root,
            "rows": rows,
            "width": width // widest row
        };
    };

    ts.render = function (nodes, idField, parentField) {
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
