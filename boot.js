//the boot state adjusts the stage size and scale
var boot = function(game) {};

boot.prototype = {
    create: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 480;
        this.scale.minHeight = 260;
        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 768;
        this.scale.forceLandscape = true;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize(true); //may need to remove/change this since method is deprecated
        //this is where we can load a wrapper menu instead of the preload state of first game
        this.game.state.start("Wrapper");
    }
};

