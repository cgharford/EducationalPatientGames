(function() {

    // Handle into boot state
    window.boot = function(game) {

    };

    window.boot.prototype = {

      	create: function(){
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    		this.scale.pageAlignHorizontally = true;
    		this.scale.setScreenSize();
    		this.game.state.start("Preload");
    	}

    };

})();
