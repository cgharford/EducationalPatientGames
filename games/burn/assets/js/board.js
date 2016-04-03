// TODO: If we were to do this absolutely correctly, we should be a bit smarter
// about cheating and the likes. For instance, it would be incredibly easy to
// simply modify the timer before "completing" the puzzle, thereby having an
// impossible score. If we had time, I would like to actually setup a web framework
// on the server to sync with the client side and check modifications. Perhaps
// future projects could look into integrating Ruby on Rails or Django with the
// project (it is possible to do with Microsoft Azure)

/**
 * Puzzle Piece
 * ==================================
 *
 * Representation of a puzzle piece.
*/
var TileTemplate = function(width, height) {

    this.width  = width;
    this.height = height;
    this.top    = this.Edge.FLAT;
    this.right  = this.Edge.FLAT;
    this.bottom = this.Edge.FLAT;
    this.left   = this.Edge.FLAT;

    // Get Values
    // Convenience function for shaping tiles
    this.getEdges = function() {
        return [this.top, this.right, this.bottom, this.left];
    };

    // Create Tile
    // Goes through and masks the piece, creates the border, and the tile raster
    this.createTile = function(image, position) {

        // Create Mask
        var mask = this.createMask();

        // Obtain tile raster
        var clone = image.clone();
        var size = new Size(this.width, this.height);
        var offset = new Point(this.width * position[0], this.height * position[1]);
        var tileRaster = this.createTileRaster(clone, size, offset);

        // Create border
        var border = mask.clone();
        border.strokeColor = '#CCC';
        border.strokeWidth = 15;

        // Join all components together to form the tile
        return new Group(mask, border, tileRaster);
    };

    // Create Mask
    //
    // The following applies to tile pieces to obtain the look of a puzzle piece.
    // A path forming to the shape of a puzzle piece (according to the +/-1) value
    // of the edge is pathed out, and eventually returned to apply to the piece
    // in question.
    this.createMask = function() {

        var ratio = this.width / 100.0;
        var curvyCoords = [
              0, 0, 35, 15, 37, 5,
              37, 5, 40, 0, 38, -5,
              38, -5, 20, -20, 50, -20,
              50, -20, 80, -20, 62, -5,
              62, -5, 60, 0, 63, 5,
              63, 5, 65, 15, 100, 0
        ];

        var mask = new Path();
        var tileCenter = view.center;

        // We build the path around the rectangular piece
        var topLeftEdge = new Point(-4, 4);
        mask.moveTo(topLeftEdge);
        for (var i = 0; i < curvyCoords.length / 6; i++) {
            var p1 = topLeftEdge + new Point(curvyCoords[i * 6 + 0] * ratio, this.top * curvyCoords[i * 6 + 1] * ratio);
            var p2 = topLeftEdge + new Point(curvyCoords[i * 6 + 2] * ratio, this.top * curvyCoords[i * 6 + 3] * ratio);
            var p3 = topLeftEdge + new Point(curvyCoords[i * 6 + 4] * ratio, this.top * curvyCoords[i * 6 + 5] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        var topRightEdge = topLeftEdge + new Point(this.width, 0);
        for (var i = 0; i < curvyCoords.length / 6; i++) {
            var p1 = topRightEdge + new Point(-this.right * curvyCoords[i * 6 + 1] * ratio, curvyCoords[i * 6 + 0] * ratio);
            var p2 = topRightEdge + new Point(-this.right * curvyCoords[i * 6 + 3] * ratio, curvyCoords[i * 6 + 2] * ratio);
            var p3 = topRightEdge + new Point(-this.right * curvyCoords[i * 6 + 5] * ratio, curvyCoords[i * 6 + 4] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        var bottomRightEdge = topRightEdge + new Point(0, this.width);
        for (var i = 0; i < curvyCoords.length / 6; i++) {
            var p1 = bottomRightEdge - new Point(curvyCoords[i * 6 + 0] * ratio, this.bottom * curvyCoords[i * 6 + 1] * ratio);
            var p2 = bottomRightEdge - new Point(curvyCoords[i * 6 + 2] * ratio, this.bottom * curvyCoords[i * 6 + 3] * ratio);
            var p3 = bottomRightEdge - new Point(curvyCoords[i * 6 + 4] * ratio, this.bottom * curvyCoords[i * 6 + 5] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        var bottomLeftEdge = bottomRightEdge - new Point(this.width, 0);
        for (var i = 0; i < curvyCoords.length / 6; i++) {
            var p1 = bottomLeftEdge - new Point(-this.left * curvyCoords[i * 6 + 1] * ratio, curvyCoords[i * 6 + 0] * ratio);
            var p2 = bottomLeftEdge - new Point(-this.left * curvyCoords[i * 6 + 3] * ratio, curvyCoords[i * 6 + 2] * ratio);
            var p3 = bottomLeftEdge - new Point(-this.left * curvyCoords[i * 6 + 5] * ratio, curvyCoords[i * 6 + 4] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        mask.opacity = 0.25;
        mask.strokeColor = '#FFF';

        return mask;
    };

    // Create Tile Raster
    //
    // The following pulls out the segment of the image in question (with some
    // margin), setting the data of the raster to the segment
    this.createTileRaster = function(src, size, offset) {
        var marginWidth = this.width * 0.203125;
        var tileWithMarginWidth = size.width + marginWidth * 2;
        var raster = new Raster(document.getElementById('empty'));
        raster.position = new Point(28, 36);
        raster.setData(src.getData(
            new Rectangle(
                offset.x - marginWidth,
                offset.y - marginWidth,
                tileWithMarginWidth,
                tileWithMarginWidth)),
            new Point(0, 0));
        return raster;
    };

};

// The edge indicates how the piece meets with another piece. It is not possible
// to place one piece to another if the sum of their edges do not add to 0
TileTemplate.prototype.Edge = Object.freeze({
    FLAT: 0,
    CONVEX: 1,
    CONCAVE: -1
});

/**
 * Puzzle
 * ==================================
 *
 * Representation of the actual puzzle and its current state.
*/
var Puzzle = function() {

    // Get Dimension
    //
    // Convenience function that returns the dimension of the puzzle according
    // to the difficulty class. The returned value is of form [width, height].
    this.getDimension = function() {
        switch(this.difficulty) {
            case this.Difficulty.EASY:
                return [2, 2];
            case this.Difficulty.MEDIUM:
                return [3, 3];
            case this.Difficulty.HARD:
                return [4, 4];
            case this.Difficulty.INSANE:
                return [5, 5];
            case this.Difficulty.NIGHTMARE:
                return [6, 6];
            default:
                return [1, 1];
        }
    };

    // Randomize Edges
    //
    // When creating the puzzle, each piece is setup so that each side is
    // either flat (if on the edge of the puzzle), convex, or concave. These
    // are represented by the TileTemplate.prototype.Edge enumeration. All adjacent
    // edges should add to 0 - if all pieces are connected and the sum is 0,
    // then the puzzle must be completed.
    //
    // We first define the outer edges, adding all the pieces and then define
    // the inner edges.
    this.randomizeEdges = function() {
        var outlines = [];
        var width = this.getDimension()[0];
        var height = this.getDimension()[1];
        for(var i = 0; i < width; i++) {
            for(var j = 0; j < height; j++) {
                outlines.push(new TileTemplate(this.tileWidth, this.tileHeight));
            }
        }

        // Randomize the right and bottom of each piece, and match the corresponding
        // edge to add to 0
        for(var i = 0; i < height; i++) {
            for(var j = 0; j < width; j++) {
                if(j < width - 1) {
                    outlines[i * height + j].right = (Math.random() >= 0.5) ? 1 : -1;
                    outlines[i * height + j + 1].left = -outlines[i * height + j].right;
                }
                if(i < height - 1) {
                    outlines[i * height + j].bottom = (Math.random() >= 0.5) ? 1 : -1;
                    outlines[(i+1) * height + j].top = -outlines[i * height + j].bottom;
                }
            }
        }

        return outlines;
    };

    // The following function bootstraps the puzzle onto the canvas for
    // manipulating. In particular, it randomizes the pieces after generating
    // them, and allows for them to be moved and linked together. Note the
    // passed @selector is the selector of the canvas object the puzzle should
    // be placed onto.
    this.load = function(config) {

        // General Properties
        this.tiles = [];
        this.path = config.path;
        this.difficulty = config.difficulty;
        this.image = new Raster(config.image);
        this.image.opacity = 0;

        // Tile Properties
        var width = this.getDimension()[0];
        var height = this.getDimension()[1];

        this.tileWidth = this.image.width / width;
        this.tileHeight = this.image.height / height;

        // Building the tiles and collecting them
        var templates = this.randomizeEdges();
        for(var i = 0; i < height; i++) {
            for(var j = 0; j < width; j++) {
                var templ = templates[i * width + j];
                var tile = templ.createTile(this.image, [j, i]);

                tile.opacity = 1;
                tile.clipped = true;
                tile.shape = templ.getEdges();
                tile.imagePosition = new Point(j, i);

                this.tiles.push(tile);
            }
        }

        // Position the tiles on the board
        for(var i = 0; i < height; i++) {
            for(var j = 0; j < width; j++) {
                var current = this.tiles[i * width + j];
                current.position = new Point(0, 0);
                current.cellPosition = new Point(j + 1, i + 1);
            }
        }

    }

};

Puzzle.prototype.Difficulty = Object.freeze({
    EASY: 0,      // 2x2
    MEDIUM: 1,    // 3x3
    HARD: 2,      // 4x4
    INSANE: 3,    // 5x5
    NIGHTMARE: 4, // 6x6
});

/**
 * Global reference
 * ==================================
 *
 * Note that, in order to continue using Paperscript, but still reference the
 * puzzle object outside of the script, we first run the board.js script and
 * afterward run puzzle.js, which will bootstrap our choices of puzzle and
 * difficulty.
*/
window.puzzle = new Puzzle();
