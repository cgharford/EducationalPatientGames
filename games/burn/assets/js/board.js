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
var TileTemplate = function(width, height, margin) {

    this.width  = width;
    this.height = height;
    this.margin = margin;
    this.top    = this.Edge.FLAT;
    this.right  = this.Edge.FLAT;
    this.bottom = this.Edge.FLAT;
    this.left   = this.Edge.FLAT;

    // Create Tile
    // Goes through and masks the piece, creates the border, and the tile raster
    this.createTile = function(image, position) {

        // Create Mask
        var mask = this.createMask();

        // Obtain tile raster and orient
        var offset = new Point(this.width * position[0], this.height * position[1]);
        var tileRaster = this.createTileRaster(image, offset);

        // if(this.top === this.Edge.FLAT) {
        //     if(this.left === this.Edge.FLAT) {
        //         tileRaster.bounds.topLeft = mask.bounds.topLeft - new Point(this.margin, this.margin);
        //         tileRaster.bounds.bottomRight = tileRaster.bounds.topLeft + new Point(width, height);
        //     } else if(this.right === this.Edge.FLAT) {
        //         tileRaster.bounds.topRight = mask.bounds.topRight - new Point(0, this.margin);
        //         tileRaster.bounds.bottomRight = tileRaster.bounds.topRight + new Point(0, height);
        //     }
        // } else {
        //     tileRaster.opacity = 0;
        // }

        // Create border
        /*var border = mask.clone();
        border.opacity = 1;
        border.strokeColor = '#000';
        border.strokeWidth = 15;*/

        // Join all components together to form the tile
        var tile = new Group(mask, /*border, */tileRaster);
        tile.opacity = 1;
        // tile.clipped = true;
        tile.shape = [this.top, this.right, this.bottom, this.left];

        //tileRaster.bounds.center = new Point(tile.bounds.width - tile.bounds.)

        return tile;
    };

    // Create Mask
    //
    // The following applies to tile pieces to obtain the look of a puzzle piece.
    // A path forming to the shape of a puzzle piece (according to the +/-1) value
    // of the edge is pathed out, and eventually returned to apply to the piece
    // in question.
    this.createMask = function() {

        var ratio = this.width / 100.0;
        var coords = [
              0, 0, 35, 15, 37, 5,
              37, 5, 40, 0, 38, -5,
              38, -5, 20, -20, 50, -20,
              50, -20, 80, -20, 62, -5,
              62, -5, 60, 0, 63, 5,
              63, 5, 65, 15, 100, 0
        ];

        var mask = new Path();
        mask.opacity = 0.25;
        mask.strokeColor = '#FFF';

        // We build the path around the rectangular piece
        mask.moveTo(new Point(0, 0));
        for (var i = 0; i < coords.length / 6; i++) {
            var p1 = new Point(coords[i * 6 + 0] * ratio, this.top * coords[i * 6 + 1] * ratio);
            var p2 = new Point(coords[i * 6 + 2] * ratio, this.top * coords[i * 6 + 3] * ratio);
            var p3 = new Point(coords[i * 6 + 4] * ratio, this.top * coords[i * 6 + 5] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        var topRightEdge = new Point(this.width, 0);
        for (var i = 0; i < coords.length / 6; i++) {
            var p1 = topRightEdge + new Point(-this.right * coords[i * 6 + 1] * ratio, coords[i * 6 + 0] * ratio);
            var p2 = topRightEdge + new Point(-this.right * coords[i * 6 + 3] * ratio, coords[i * 6 + 2] * ratio);
            var p3 = topRightEdge + new Point(-this.right * coords[i * 6 + 5] * ratio, coords[i * 6 + 4] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        var bottomRightEdge = topRightEdge + new Point(0, this.width);
        for (var i = 0; i < coords.length / 6; i++) {
            var p1 = bottomRightEdge - new Point(coords[i * 6 + 0] * ratio, this.bottom * coords[i * 6 + 1] * ratio);
            var p2 = bottomRightEdge - new Point(coords[i * 6 + 2] * ratio, this.bottom * coords[i * 6 + 3] * ratio);
            var p3 = bottomRightEdge - new Point(coords[i * 6 + 4] * ratio, this.bottom * coords[i * 6 + 5] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        var bottomLeftEdge = bottomRightEdge - new Point(this.width, 0);
        for (var i = 0; i < coords.length / 6; i++) {
            var p1 = bottomLeftEdge - new Point(-this.left * coords[i * 6 + 1] * ratio, coords[i * 6 + 0] * ratio);
            var p2 = bottomLeftEdge - new Point(-this.left * coords[i * 6 + 3] * ratio, coords[i * 6 + 2] * ratio);
            var p3 = bottomLeftEdge - new Point(-this.left * coords[i * 6 + 5] * ratio, coords[i * 6 + 4] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        return mask;
    };

    // Create Tile Raster
    //
    // The following pulls out the segment of the image in question (with some
    // margin), setting the data of the raster to the segment. Note the 'empty'
    // image is literally an empty image that we use as an empty template to
    // begin with and then replace with the necessary content
    this.createTileRaster = function(src, offset) {
        var bounds = new Rectangle(
            offset.x - this.margin,
            offset.y - this.margin,
            this.width + 2 * this.margin,
            this.height + 2 * this.margin);
        var tmp = src.getSubRaster(bounds);
        return tmp;
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
                outlines.push(new TileTemplate(this.tileWidth, this.tileHeight, this.marginWidth));
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

    // Build Tiles
    //
    // The following function constructs the tiles out of the tile templates also
    // constructed within the function. They are not placed in any particular location
    // by this call.
    //
    // @width: The number of tiles per row
    // @height: The number of tiles per column
    this.buildTiles = function(tilesPerRow, tilesPerCol) {
        var tiles = [];
        var templates = this.randomizeEdges();
        for(var i = 0; i < tilesPerCol; i++) {
            for(var j = 0; j < tilesPerRow; j++) {
                var templ = templates[i * tilesPerRow + j];
                var tile = templ.createTile(this.image, [j, i]);
                tile.imagePosition = new Point(j, i);
                tile.cellPosition = new Point(j + 1, i + 1);
                tiles.push(tile);
            }
        }

        return tiles;
    }

    // Scale Board
    //
    // Because of the different difficulty levels and potentially different sized
    // images, we must compute where the pieces may snap too when placing a piece
    // down. The pieces beginon the right 20% of the board, and they are placed on
    // the left 80% of the board.
    this.scaleBoard = function(targetRatio) {
        var canvas = $(view.element);
        view.viewSize = new Size(canvas.width(), canvas.height());
        for(var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].scale(targetRatio * view.viewSize.width / this.tiles[i].bounds.width);
        }
        view.draw();
    };

    // Place Pieces
    //
    // If a piece has not yet been placed, we place the piece in an arbitrary location.
    // I initially tried setting up a sideboard on which to hold the pieces, but this proved
    // a bit unwieldy in terms of both programming and using.
    this.placePieces = function() {
        for(var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].position = new Point(Math.random() * view.viewSize.width, Math.random() * view.viewSize.height);
        }
    };

    // Load
    //
    // The following function bootstraps the puzzle onto the canvas for
    // manipulating. In particular, it randomizes the pieces after generating
    // them, and allows for them to be moved and linked together. Note the
    // passed @selector is the selector of the canvas object the puzzle should
    // be placed onto.
    //
    // @config: Properties for loading board
    this.load = function(config) {

        // General Properties
        this.tiles = [];
        this.path = config.path;
        this.difficulty = config.difficulty;

        // Square Image
        this.image = new Raster(config.image);
        var length = Math.min(this.image.width, this.image.height);
        this.image.scale(length / this.image.width, length / this.image.height);
        this.image.opacity = 0;

        // Tile Properties
        var tilesPerRow = this.getDimension()[0];
        var tilesPerCol = this.getDimension()[1];

        this.tileWidth = this.image.bounds.width / tilesPerRow;
        this.tileHeight = this.image.bounds.height / tilesPerCol;
        this.marginWidth = this.tileWidth * 0.203125;

        // Initialize the board
        this.tiles = this.buildTiles(tilesPerRow, tilesPerCol);
        $(window).trigger('resize');

        // Position the tiles on the board relative to one another
        // for(var i = 0; i < height; i++) {
        //     for(var j = 0; j < width; j++) {
        //         var current = this.tiles[i * width + j];
        //         //current.position = new Point(j * this.tileWidth, i * this.tileWidth);
        //         if(j === 1) {
        //             var delta = current.bounds.topRight.x - current.bounds.topLeft.x;
        //             current.bounds.topLeft = new Point(this.tiles[0].bounds.topRight.x - 3 * this.marginWidth / 2, this.tiles[0].bounds.topRight.y);
        //             current.bounds.topRight = new Point(current.bounds.topLeft.x + delta, current.bounds.topLeft.y);
        //         }
        //     }
        // }
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
$(window).resize(function() {
    //window.puzzle.scaleBoard(0.25);
    window.puzzle.placePieces();
})
