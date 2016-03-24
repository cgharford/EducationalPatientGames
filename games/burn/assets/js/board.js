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
    var raster_bg = new Raster('assets/imgs/' + background);

    

}();
