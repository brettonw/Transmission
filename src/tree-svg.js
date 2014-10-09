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
        var roots = [];
        for (var i = 0, count = nodes.length; i < count; ++i) {
            var node = nodes[i];
            var id = node[idField];
            var container = getContainerById(id, node);
            var parentId = node[parentIdField];
            if (parentId != null) {
                var parentContainer = getContainerById(parentId, null);
                parentContainer.children.push(container);
                container.parent = parentContainer;
            } else {
                roots.push (container);
            }
        }

        // return the finished result
        return roots;
    };

    ts.sweepAndCount = function (root) {
        var rows = [];
        var maxRowWidth = 0;
        var recursiveSweepAndCount = function (rowIndex, container) {
            // add a row if there isn't one
            if (!(rowIndex in rows)) {
                rows[rowIndex] = [];
            }

            // add this node to the current row, and update the container with 
            // the counter
            container.rowIndex = rowIndex;
            rows[rowIndex].push(container);
            maxRowWidth = Math.max(rows[rowIndex].length, maxRowWidth);

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
            "width": maxRowWidth // widest row
        };
    };

    ts.render = function (tree) {
        // create the raw SVG picture for display, assumes a width/height aspect ratio of 3/2
        var buffer = 0.15;
        var svg = '<div class="tree-svg-div">' +
                    '<svg class="tree-svg-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" ' +
                    'viewBox="-0.1, -0.1, 1.7, 1.1" ' +
                    'preserveAspectRatio="xMidYMid meet"' +
                    '>';

        var rowCount = tree.rows.length;
        var vSpacing = 1.0 / rowCount;

        // recursive layout in uniform scale space
        var recursiveLayout = function (x, node) {
            var childCount = node.children.length;
            var childX = x;
            if (childCount > 0) {
                childX = recursiveLayout (x, node.children[0]);
                for (var i = 1; i < childCount; ++i) {
                    childX = recursiveLayout(childX + 1, node.children[i]);
                }
            }

            // compute layout
            node.x = (x + childX) / 2.0;
            node.y = (node.rowIndex + 0.5) * vSpacing;

            return childX;
        };
        var width = recursiveLayout(0, tree.root);

        // recursive re-scaling to fit in the drawing space
        var scale = 1.5 / width;
        var recursiveScale = function (node) {
            for (var i = 0, childCount = node.children.length; i < childCount; ++i) {
                recursiveScale(node.children[i]);
            }
            node.x *= scale;
        };
        recursiveScale(tree.root);

        // utility function for getting the tension right on the quadratic 
        // Bezier curve we'll use for the edges
        var lerp = function (a, b, i) {
            return (a * i) + (b * (1.0 - i));
        };

        // draw the edges
        var recursiveDrawEdges = function (node) {
            for (var i = 0, childCount = node.children.length; i < childCount; ++i) {
                var c = node.children[i];
                //svg += '<line x1="' + node.x + '" y1="' + node.y + '" x2="' + c.x + '" y2="' + c.y + '" stroke="black" stroke-width="0.002" />';
                recursiveDrawEdges(node.children[i]);
                var mid = { x: (node.x + c.x) / 2.0, y: (node.y + c.y) / 2.0 };
                svg += '<path d="M' + node.x + ',' + node.y + ' Q' + node.x + ',' + lerp(node.y, mid.y, 0.4) + ' ' + mid.x + ',' + mid.y + ' T' + c.x + ',' + c.y + '" fill="none" stroke="black" stroke-width="0.002"  />'
            }
        };
        recursiveDrawEdges(tree.root);

        // draw the nodes
        var radius = Math.max (Math.min(scale * 0.33, vSpacing * 0.25), 0.01);
        var recursiveDrawNodes = function (node) {
            for (var i = 0, childCount = node.children.length; i < childCount; ++i) {
                recursiveDrawNodes(node.children[i]);
            }
            svg += '<circle cx="' + node.x + '" cy="' + node.y + '" r="' + radius + '" stroke="black" stroke-width="0.002" fill="red" />';
        };
        recursiveDrawNodes(tree.root);

        // close the plot
        svg += "</div><br>";
        return svg;
    };

    return ts;
}();
