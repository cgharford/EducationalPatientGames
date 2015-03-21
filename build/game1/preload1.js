//used to preload images for game1
var preload1 = function(game) {};

preload1.prototype = {
    preload: function() {
        this.game.load.image('play button', './assets/images/button1.png');
        this.game.load.spritesheet('safe', './assets/images/spritesheets/h-bikegirl-red.png', 80, 80);
        this.game.load.spritesheet('unsafe', './assets/images/spritesheets/bikegirl-red.png', 80, 80);

    },
    create: function() {
        this.game.state.add("Title1",title1);
        this.game.state.add("Game1",game1);
        this.game.state.add("Victory1",victory1);
        this.game.state.start("Title1");
    }
};