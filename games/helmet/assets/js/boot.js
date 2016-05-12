(function() {

    // Handle into boot state
    window.boot = function(game) {

    };

    window.boot.prototype = {

      	create: function(){
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
    		this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
    		this.scale.setScreenSize();
    		this.game.state.start("Preload");
    	}

    };

})();
