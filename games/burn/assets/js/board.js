// TODO: If we were to do this absolutely correctly, we should be a bit smarter
// about cheating and the likes. For instance, it would be incredibly easy to
// simply modify the timer before "completing" the puzzle, thereby having an
// impossible score. If we had time, I would like to actually setup a web framework
// on the server to sync with the client side and check modifications. Perhaps
// future projects could look into integrating Ruby on Rails or Django with the
// project (it is possible to do with Microsoft Azure)

/**
 * Tile Template
 * ==================================
 *
 * The tile template is essentially a factory (via the function @createTile) to
 * create puzzle pieces. Note that the width and height passed into the constructor
 * is not necessarily the actual width and height of the puzzle piece since we
 * mask the image. Rather, these are dimensions of the unclipped raster.
 *
 * @width: The width of the raster of the piece
 * @height: The height of the raster of the piece
*/
var TileTemplate = function(width, height) {

    // Dimensions
    this.width = width;
    this.height = height;
    this.margin = width * 0.203125;

    // To begin with, we set all edges to the flat end and then randomly adjust
    // the edges (unless it is an edge piece)
    this.top    = this.Edge.FLAT;
    this.right  = this.Edge.FLAT;
    this.bottom = this.Edge.FLAT;
    this.left   = this.Edge.FLAT;

    // Create Tile
    // ----------------------------------
    //
    // Main method used to construct our puzzle piece. Masks the passed image,
    // creates the border, etc.
    //
    // @image: The image file being adjusted
    // @position: The cell position of the constructed piece.
    this.createTile = function(image, position) {

        // Create Mask
        var mask = this.createMask();
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

        // Used for snapping; the central raster forms a perfect square
        // and can be used for shaping properly (try setting tile.clipped to
        // false if this isn't clear)
        tile.centralRaster = tileRaster.children[0];

        // Used to join pieces together. That is, when a piece snaps to another
        // piece, we must now look at the two pieces as if they were one. In this
        // way, if one is moved, both must move.
        tile.joint = {
            pieces: [tile],         // A group will always contain the initial piece
            bounds: undefined       // Defined when pieces are placed initially
        };

        return tile;
    };

    // Create Mask
    // ----------------------------------
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
    // ----------------------------------
    //
    // The following pulls out the segment of the image in question (with some
    // margin), setting the data of the raster to the segment. Note that we
    // scale the raster into a square for the sake of simplicity when creating
    // the actual pieces.
    //
    // @src: The image a subraster is being generated from
    // @offset: The x, y coordinate in which the topleft corner of the square used
    //          to segment the image starts at
    this.createTileRaster = function(src, offset) {

        // Contains the central raster and raster's used in margins
        var rasters = [];

        // Square the raster
        var length = Math.min(this.width, this.height);
        var tileRaster = src.getSubRaster(new Rectangle(offset.x, offset.y, this.width, this.height));
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
 * Board
 * ==================================
 *
 * Representation of the actual puzzle and its current state. This class handles
 * piece manipulation, snapping, boundaries, etc. and will also trigger a callback
 * when the puzzle is complete.
*/
var Board = function() {

    // Randomize Edges
    // ----------------------------------
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
        var width = this.dimension;
        var height = this.dimension;
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
    // ----------------------------------
    //
    // The following function constructs the tiles out of tile templates. We create
    // each piece in order of cell position (row-wise first) and then randomize
    // the tiles position afterward.
    this.buildTiles = function() {
        var tiles = [];
        var templates = this.randomizeEdges();
        for(var i = 0; i < this.dimension; i++) {
            for(var j = 0; j < this.dimension; j++) {
                var templ = templates[i * this.dimension + j];
                var tile = templ.createTile(this.image, [j, i]);
                tile.imagePosition = new Point(j, i);
                tile.cellPosition = new Point(j + 1, i + 1);
                tiles.push(tile);
            }
        }

        return tiles;
    }

    // Place Pieces
    // ----------------------------------
    //
    // I initially tried setting up a sideboard on which to hold the pieces, but this proved
    // a bit unwieldy in terms of both programming and using. Instead, I simply shuffle the
    // pieces around the canvas.
    this.placePieces = function() {

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

        // We then push each piece evenly around the canvas
        for(var i = 0; i < reordering.length; i++) {
            var x = i % this.dimension;
            var y = Math.floor(i / this.dimension);
            var posX = view.bounds.width / this.dimension * x + reordering[i].bounds.width / 2;
            var posY = view.bounds.height / this.dimension * y + reordering[i].bounds.height / 2;
            reordering[i].position = new Point(view.bounds.x + posX, view.bounds.y + posY);
            reordering[i].joint.bounds = reordering[i].bounds.clone();
            project.activeLayer.addChild(reordering[i]);
        }

    };

    // Bound Group
    // ----------------------------------
    //
    // Ensure that the pieces stay within the canvas when dragged or the canvas resized.
    // Since each puzzle piece belongs to a group (all pieces any one piece is connected to),
    // we must check that the group in question is completely within the canvas.
    this.boundGroup = function(group) {

        // Convenience function for adjusting all piece positions
        var reposition = function(x, delta) {
            for(var i = 0; i < group.pieces.length; i++) {
                group.pieces[i].position[x ? 'x' : 'y'] += delta;
            }
        }

        // Check left handed bounds
        if(group.bounds.x <= view.bounds.x) {
            reposition(true, view.bounds.x - group.bounds.x);
            group.bounds.x = view.bounds.x;

        // Check right handed bounds
        } else if(group.bounds.x + group.bounds.width >= view.bounds.x + view.bounds.width) {
            reposition(true, view.bounds.x + view.bounds.width - (group.bounds.x + group.bounds.width));
            group.bounds.x = view.bounds.x + view.bounds.width - group.bounds.width;
        }

        // Check top handed bounds
        if(group.bounds.y <= view.bounds.y) {
            reposition(false, view.bounds.y - group.bounds.y);
            group.bounds.y = view.bounds.y;

        // Check bottom handed bounds
        } else if(group.bounds.y + group.bounds.height >= view.bounds.y + view.bounds.height) {
            reposition(false, view.bounds.y + view.bounds.height - (group.bounds.y + group.bounds.height));
            group.bounds.y = view.bounds.y + view.bounds.height - group.bounds.height;
        }
    };

    // Expand Group
    // ----------------------------------
    //
    // Convenience function intended to adjust a group. That is, when I move a group
    // towards another puzzle piece and they actually bind together, then we need to
    // extend the current group to include the joined group and consequently consider
    // them all collectively as one larger new group.
    //
    // @moved: The puzzle piece being moved
    // @target: The puzzle piece moved next to
    this.extendGroup = function(moved, target) {

        // We always extend the larger group
        var larger = moved.joint;
        var smaller = target.joint;
        if(moved.joint.pieces.length < target.joint.pieces.length) {
            larger = target.joint;
            smaller = moved.joint;
        }

        // For use in boundaries
        var left = larger.bounds.x;
        var top = larger.bounds.y;
        var right = larger.bounds.x + larger.bounds.width;
        var bottom = larger.bounds.y + larger.bounds.height;

        // Next extend the group to include the newly attached pieces
        // Note we check that the smaller pieces do not actually already
        // belong to the larger group (without this check, the pieces would
        // be repeatedly added to the same group whenever a mouse click occurs
        // on an already combined piece).
        for(var i = 0; i < smaller.pieces.length; i++) {
            if(smaller.pieces[i].joint !== larger) {
                larger.pieces.push(smaller.pieces[i]);
                smaller.pieces[i].joint = larger;
            }
        }

        // Adjust position
        for(var i = 0; i < larger.pieces.length; i++) {
            larger.bounds.x = Math.min(larger.pieces[i].bounds.x, larger.bounds.x);
            larger.bounds.y = Math.min(larger.pieces[i].bounds.y, larger.bounds.y);
        }

        // Adjust size
        for(var i = 0; i < larger.pieces.length; i++) {
            var piece = larger.pieces[i];
            if(piece.bounds.x + piece.bounds.width > larger.bounds.x + larger.bounds.width) {
                larger.bounds.width = piece.bounds.x + piece.bounds.width - larger.bounds.x;
            }
            if(piece.bounds.y + piece.bounds.height > larger.bounds.y + larger.bounds.height) {
                larger.bounds.height = piece.bounds.y + piece.bounds.height - larger.bounds.y;
            }
        }
    };

    // Snap Piece
    // ----------------------------------
    //
    // We snap the piece depending on how close it is to the corresponding puzzle piece.
    // Note we base this off the central raster of the tile since, when the tiles are not
    // clipped, they form a perfect square.
    //
    // @moved: Tile moved
    // @target: Tile checking to be snapped to
    // @snapDelta: Proximity necessary for snapping
    // @return: Whether or not a snapping was successful
    this.snapPiece = function(moved, target, snapDelta) {

        // Snapping is technically performed with pieces already snapped to.
        // If this is the case, we should not be trying to snap them again.
        if(target.joint === moved.joint) {
            return false;
        }

        // This check makes sure we are working with an adjacent tile
        var cellDeltaX = Math.abs(target.cellPosition.x - moved.cellPosition.x);
        var cellDeltaY = Math.abs(target.cellPosition.y - moved.cellPosition.y);
        if(cellDeltaX + cellDeltaY !== 1) {
            return false;
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

        // Positions group to fit snug against joined piece and then combines
        // all pieces together
        if(Math.abs(deltaX) < snapDelta && Math.abs(deltaY) < snapDelta) {
            for(var i = 0; i < moved.joint.pieces.length; i++) {
                moved.joint.pieces[i].position += new Point(deltaX, deltaY);
            }
            this.extendGroup(moved, target);
            return true;
        }

        return false;
    };

    // Load
    // ----------------------------------
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
        this.dimension = config.dimension;

        // Square Image
        this.image = new Raster(config.image);
        this.image.opacity = 0;

        this.tileWidth = this.image.bounds.width / this.dimension;
        this.tileHeight = this.image.bounds.height / this.dimension;
        this.tiles = this.buildTiles();

        // Event Setup
        for(var i = 0; i < that.tiles.length; i++) {

            // Allow movement of each tile piece. Note these will snap together
            // if they are placed in the correct position. When this occurs, we
            // move the attached pieces as a unit
            that.tiles[i].onMouseDrag = function(event) {
                this.joint.bounds.x += event.delta.x;
                this.joint.bounds.y += event.delta.y;
                for(var j = 0; j < this.joint.pieces.length; j++) {
                    this.joint.pieces[j].position += event.delta;
                }
                that.boundGroup(this.joint);
            }

            // How close a piece needs to be next to another to snap
            // into place and conjoin into one. We must check for each
            // side once this occurs. When checking whether pieces are
            // properly joined, we use the central raster as our means
            // of measurement since they form a perfect square when the
            // tile is not clipped.
            //
            // Note if anyone of the pieces in the group snap in place,
            // the rest of the group should also be in the correct spot
            that.tiles[i].onMouseUp = function(event) {
                for(var j = 0; j < this.joint.pieces.length; j++) {
                    for(var k = 0; k < that.tiles.length; k++) {
                        if(that.snapPiece(this.joint.pieces[j], that.tiles[k], 200)) {
                            return;
                        }
                    }
                }
            }
        }

        // Initialize the board
        var canvas = $(view.element);
        view.setViewSize(canvas.width(), canvas.height());
        $(window).trigger('resize');
        this.placePieces();
    }

};

/**
 * Global reference
 * ==================================
 *
 * Note that, in order to continue using Paperscript, but still reference the
 * puzzle object outside of the script, we first run the board.js script and
 * afterward run puzzle.js, which will bootstrap our choices of puzzle and
 * difficulty.
*/
window.puzzle = new Board();
$(window).resize(function() {
    if(window.puzzle.loaded) {

        // Because of the different difficulty levels and potentially different sized
        // images, we must scale the board in such a way that the completed puzzle will
        // fit completely within the canvas.
        var ratio = 0.9;
        var canvas = $(view.element);
        var tileWidth = window.puzzle.tiles[0].bounds.width;
        var minimumSide = Math.min(canvas.width(), canvas.height());
        view.zoom = (ratio * minimumSide) / (window.puzzle.dimension * tileWidth);

        // We must also make sure each piece is bound within the canvas.
        for(var i = 0; i < window.puzzle.tiles.length; i++) {
            if(window.puzzle.tiles[i].joint.bounds !== undefined) {
                window.puzzle.boundGroup(window.puzzle.tiles[i].joint);
            }
        }

    }
})
