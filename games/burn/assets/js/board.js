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

    this.width = width;
    this.height = height;
    this.margin = width * 0.203125;

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

        // Create border
        var border = mask.clone();
        border.opacity = 1;
        border.strokeWidth = 5;
        border.strokeColor = '#000';

        // Join all components together to form the tile
        var tile = new Group(mask, tileRaster, border);
        tile.opacity = 1;
        tile.clipped = true;
        tile.centralRaster = tileRaster.children[0];
        tile.shape = [this.top, this.right, this.bottom, this.left];

        return tile;
    };

    // Create Mask
    //
    // The following applies to tile pieces to obtain the look of a puzzle piece.
    // A path forming to the shape of a puzzle piece (according to the +/-1) value
    // of the edge is pathed out, and eventually returned to apply to the piece
    // in question.
    this.createMask = function() {

        var length = Math.min(this.width, this.height);
        var ratio = length / 100.0;
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

        var topRightEdge = new Point(length, 0);
        for (var i = 0; i < coords.length / 6; i++) {
            var p1 = topRightEdge + new Point(-this.right * coords[i * 6 + 1] * ratio, coords[i * 6 + 0] * ratio);
            var p2 = topRightEdge + new Point(-this.right * coords[i * 6 + 3] * ratio, coords[i * 6 + 2] * ratio);
            var p3 = topRightEdge + new Point(-this.right * coords[i * 6 + 5] * ratio, coords[i * 6 + 4] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        var bottomRightEdge = topRightEdge + new Point(0, length);
        for (var i = 0; i < coords.length / 6; i++) {
            var p1 = bottomRightEdge - new Point(coords[i * 6 + 0] * ratio, this.bottom * coords[i * 6 + 1] * ratio);
            var p2 = bottomRightEdge - new Point(coords[i * 6 + 2] * ratio, this.bottom * coords[i * 6 + 3] * ratio);
            var p3 = bottomRightEdge - new Point(coords[i * 6 + 4] * ratio, this.bottom * coords[i * 6 + 5] * ratio);
            mask.cubicCurveTo(p1, p2, p3);
        }

        var bottomLeftEdge = bottomRightEdge - new Point(length, 0);
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

        var rasters = [];

        // Square the raster
        var tileRaster = src.getSubRaster(new Rectangle(offset.x, offset.y, this.width, this.height));
        var length = Math.min(this.width, this.height);
        tileRaster.scale(length / tileRaster.bounds.width, length / tileRaster.bounds.height);
        tileRaster.position = new Point(length / 2, length / 2);
        rasters.push(tileRaster);

        // Because we have to reshape the raster, the margins of the tiles are
        // rendered separately and grouped together with the main raster
        if(this.top !== this.Edge.FLAT) {
            var rect = new Rectangle(offset.x, offset.y - this.margin, this.width, this.margin);
            var mTop = src.getSubRaster(rect);
            mTop.scale(length / mTop.bounds.width, 1);
            mTop.position = new Point(length / 2, -this.margin / 2);
            rasters.push(mTop);
        }

        if(this.right !== this.Edge.FLAT) {
            var rect = new Rectangle(offset.x + this.width, offset.y, this.margin, this.height);
            var mRight = src.getSubRaster(rect);
            mRight.scale(1, length / mRight.bounds.height);
            mRight.position = new Point(length + this.margin / 2, length / 2);
            rasters.push(mRight);
        }

        if(this.bottom !== this.Edge.FLAT) {
            var rect = new Rectangle(offset.x, offset.y + this.height, this.width, this.margin);
            var mBottom = src.getSubRaster(rect);
            mBottom.scale(length / mBottom.bounds.width, 1);
            mBottom.position = new Point(length / 2, length + this.margin / 2);
            rasters.push(mBottom);
        }

        if(this.left !== this.Edge.FLAT) {
            var rect = new Rectangle(offset.x - this.margin, offset.y, this.margin, this.height);
            var mLeft = src.getSubRaster(rect);
            mLeft.scale(1, length / mLeft.bounds.height);
            mLeft.position = new Point(-this.margin / 2, length / 2);
            rasters.push(mLeft);
        }

        // Group all rasters together
        return new Group(rasters);
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
    this.scaleBoard = function(ratio) {
        var canvas = $(view.element);
        var tilesPerRow = this.getDimension()[0];
        var tileWidth = this.tiles[0].bounds.width;
        var minimumSide = Math.min(canvas.width(), canvas.height());
        view.zoom = (ratio * minimumSide) / (tilesPerRow * tileWidth);
    };

    // Place Pieces
    //
    // If a piece has not yet been placed, we place the piece in an arbitrary location.
    // I initially tried setting up a sideboard on which to hold the pieces, but this proved
    // a bit unwieldy in terms of both programming and using.
    this.placePieces = function() {

        // Initally place any pieces
        if(!this.placedPieces) {

            var indices = [];
            for(i = 0; i < this.tiles.length; i++) {
                indices.push(i);
            }

            // In order to randomize how the tiles are placed in the initial
            // pile, we remove all elements from the active layer and then
            // re-add them randomly
            var reordering = [];
            while(indices.length > 0) {
                var index = Math.floor(Math.random() * indices.length);
                var tile = this.tiles[indices[index]];
                indices = indices.slice(0, index).concat(indices.slice(index + 1));
                reordering.push(tile);
                tile.remove();
            }

            var canvas = $(view.element);
            for(var i = 0; i < reordering.length; i++) {
                var x = Math.random() * canvas.width();
                var y = Math.random() * canvas.height();
                reordering[i].position = new Point(x, y);
                project.activeLayer.addChild(reordering[i]);
            }
        }

        // Check that pieces are snapped properly
        for(var i = 0; i < this.tiles.length; i++) {
            this.boundPiece(this.tiles[i]);
        }

        // Ensure initial placement only occurs once
        this.placedPieces = true;
    };

    // Bound Piece
    //
    // Ensure that the pieces are within the canvas.
    this.boundPiece = function(piece) {

        // Set x-bound limits
        if(piece.position.x <= view.bounds.x + piece.bounds.width / 2) {
            piece.position.x = view.bounds.x + piece.bounds.width / 2;
        } else if(piece.position.x >= view.bounds.x + view.bounds.width - piece.bounds.width / 2) {
            piece.position.x = view.bounds.x + view.bounds.width - piece.bounds.width / 2;
        }

        // Set y-bound limits
        if(piece.position.y <= view.bounds.y + piece.bounds.height / 2) {
            piece.position.y = view.bounds.y + piece.bounds.height / 2;
        } else if(piece.position.y >= view.bounds.y + view.bounds.height - piece.bounds.height / 2) {
            piece.position.y = view.bounds.y + view.bounds.height - piece.bounds.height / 2;
        }

    };

    // Snap Piece
    //
    // We snap the piece depending on how close it is to the corresponding puzzle piece.
    // Note we base this off the central raster of the tile since, when the tiles are not
    // clipped, they form a perfect square.
    //
    // @moved: Tile moved
    // @target: Tile checking to be snapped to
    // @snapDelta: Proximity necessary for snapping
    this.snapPiece = function(moved, target, snapDelta) {

        // Note this check makes sure we are working with an adjacent tile
        var cellDeltaX = Math.abs(target.cellPosition.x - moved.cellPosition.x);
        var cellDeltaY = Math.abs(target.cellPosition.y - moved.cellPosition.y);
        if(cellDeltaX + cellDeltaY !== 1) {
            return;
        }

        // Begin tiling
        var bounds = moved.centralRaster.bounds;
        var targetBounds = target.centralRaster.bounds;

        // Setup for positioning
        var deltaX = undefined;
        var deltaY = undefined;

        // Tile to the right
        if(target.cellPosition.x > moved.cellPosition.x) {
            deltaX = targetBounds.x - (bounds.x + bounds.width);
            deltaY = targetBounds.y - bounds.y;

        // Tile to the left
        } else if(target.cellPosition.x < moved.cellPosition.x) {
            deltaX = targetBounds.x + targetBounds.width - bounds.x;
            deltaY = targetBounds.y - bounds.y;

        // Tile to the top
        } else if(target.cellPosition.y < moved.cellPosition.y) {
            deltaX = targetBounds.x - bounds.x;
            deltaY = (targetBounds.y + targetBounds.height) - bounds.y;

        // Tile to the bottom
        } else {
            deltaX = targetBounds.x - bounds.x;
            deltaY = targetBounds.y - (bounds.y + bounds.height);

        }

        // Position piece and turn into one joint piece
        if(Math.abs(deltaX) < snapDelta && Math.abs(deltaY) < snapDelta) {
            moved.position += new Point(deltaX, deltaY);

            // Clear up mouse dragging
            moved.onMouseDrag = undefined;
            target.onMouseDrag = undefined;

            // Combine into single unit (by joining the groups or just the
            // piece into a collective group).

            // Allow moving as one entire unit
            joint.onMouseDrag = function(event) {
                this.position += event.delta;
            }

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

        var that = this;

        // General Properties
        this.loaded = true;
        this.path = config.path;
        this.difficulty = config.difficulty;

        // Square Image
        this.image = new Raster(config.image);
        this.image.opacity = 0;

        // Tile Properties
        var tilesPerRow = this.getDimension()[0];
        var tilesPerCol = this.getDimension()[1];

        this.tileWidth = this.image.bounds.width / tilesPerRow;
        this.tileHeight = this.image.bounds.height / tilesPerCol;
        this.tiles = this.buildTiles(tilesPerRow, tilesPerCol);

        // Initialize the board
        var canvas = $(view.element);
        view.setViewSize(canvas.width(), canvas.height());
        $(window).trigger('resize');

        // Event Setup
        for(var i = 0; i < that.tiles.length; i++) {

            // Allow movement of each tile piece. Note these will snap together
            // if they are placed in the correct position. When this occurs, we
            // move the attached pieces as a unit
            that.tiles[i].onMouseDrag = function(event) {
                this.position += event.delta;
                that.boundPiece(this);
            }

            // How close a piece needs to be next to another to snap
            // into place and conjoin into one. We must check for each
            // side once this occurs. When checking whether pieces are
            // properly joined, we use the central raster as our means
            // of measurement since they form a perfect square when the
            // tile is not clipped.
            that.tiles[i].onMouseUp = function(event) {
                for(var j = 0; j < that.tiles.length; j++) {
                    that.snapPiece(this, that.tiles[j], 200);
                }
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
$(window).resize(function() {
    if(window.puzzle.loaded) {
        window.puzzle.scaleBoard(0.9);
        window.puzzle.placePieces();
    }
})
