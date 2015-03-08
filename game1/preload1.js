//used to preload images for game1
var preload1 = function(game) {};

preload1.prototype = {
    preload: function() {
        this.game.load.image('safe','./game1/assets/bluesquare.png');
        this.game.load.image('unsafe','./game1/assets/redsquare.png'); //todo:  load these as spritesheets and add animtions
    },
    create: function() {
        this.game.state.start("Title1");
    }
};