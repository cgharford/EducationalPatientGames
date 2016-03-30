// TODO: If we were to do this absolutely correctly, we should be a bit smarter
// about cheating and the likes. For instance, it would be incredibly easy to
// simply modify the timer before "completing" the puzzle, thereby having an
// impossible score. If we had time, I would like to actually setup a web framework
// on the server to sync with the client side and check modifications. Perhaps
// future projects could look into integrating Ruby on Rails or Django with the
// project (it is possible to do with Microsoft Azure)

+function() {

    // TODO: Provide the image randomly server side, not client side
    // This could perhaps just be a data attribute set on the canvas element
    // and then pulled up from the following code
    //
    // var raster_bg = new Raster($('#board').data('src'));
    var potential_bgs = [
        'stove-puzzle.jpg'
    ];
    var background = potential_bgs[Math.floor(Math.random() * (potential_bgs.length + 1)]);
    var background = new Raster('assets/imgs/' + background);

    // Define the puzzle piece orientations
    +function() {

        // The edge indicates how the piece meets with another piece. Ultimately,
        // it is not possible to place one piece to another if the sum of their
        // edges do not add to 0
        var Edge = Object.freeze({
            FLAT: 0,
            CONVEX: 1,
            CONCAVE: -1
        });

        // Each puzzle shape is defined as an array of 4 Edge objects
        // where the indices represent respectively top, right, bottom, left
        window.puzzle.shapePieces = function(width, height) {
            var shapes = [];

            for(var i = 0; i < width; i++) {
                for(var j = 0; j < height; j++) {

                    var currentShape = [];

                    // Top/bottom edges
                    if(i === 0) {
                        currentShape[0] = Edge.FLAT;
                    } else if(i === height - 1) {
                        currentShape[2] = Edge.FLAT;
                    }

                    // Left/right edges
                    if(j === 0) {
                        currentShape[3] = Edge.FLAT;
                    } else if(j === width - 1) {
                        currentShape[2] = Edge.FLAT;
                    }

                    shapes.push(currentShape);
                }
            }

        }

    }

}();
