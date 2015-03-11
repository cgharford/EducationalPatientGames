//the boot state adjusts the stage size and scale
var boot = function(game) {};

boot.prototype = {
    create: function() {
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //resizes game to fit parent but maintains aspect ratio
        this.scale.setMinMax(480,260,1024,768);
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        //these functions can be used to force users to use a specific orientation on mobile devices
        /*
        if (this.game.device.desktop === false) {
            this.scale.forceOrientation(true,false);
            this.scale.enterIncorrectOrientation.add(function () {}, this);
            this.scale.leaveIncorrectOrientation.add(function() {}, this);
         }*/
        //this is where we can load a wrapper menu instead of the preload state of first game
        this.game.state.start("Wrapper");
    }
};

