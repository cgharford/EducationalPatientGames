//used to preload images for game1
var preload1 = function(game) {};

preload1.prototype = {
    preload: function() {
        this.game.load.image('safe','./game1/assets/bluesquare.png');
        this.game.load.image('unsafe','./game1/assets/redsquare.png'); //todo:  load these as spritesheets and add animtions
        this.game.load.image('play button', './game1/assets/button1.png');
    },
    create: function() {
        this.game.state.add("Title1",title1);
        this.game.state.add("Game1",game1);
        this.game.state.add("Victory1",victory1);
        this.game.state.start("Title1");
    }
};