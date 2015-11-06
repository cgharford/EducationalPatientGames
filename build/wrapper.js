module.exports = {
	/**
  *wrapper class. The wrapper object, first displayed screen
  
  *@class wrapper
  *@module game
  */
    /**
     * Phaser preload function. Preloads assets needed for wrapper
     * @method preload
     * @return 
     */
    preload: function () {
        //load images for all of the games here
        this.game.load.image("wrapper-bg", "assets/general/images/wrapper.jpg");
        this.game.load.image("new-game-thumb", "assets/general/images/new-game-thumbnail.jpg");
        this.game.load.image("UIP-thumb", "assets/general/images/UIP-thumbnail.jpg");
        this.game.load.image("game2-thumbnail", "assets/game2/images/UIP-thumbnail.jpg");
    },
    /**
     * Phaser create function. Adds images needed for wrapper
     * @method create
     * @return returns boolean true if image successfully loads, false otherwise
     */
    create: function () {

        wrapperBg = this.add.sprite(1024, 768, 'wrapper-bg');
        wrapperBg.x = 0;
        wrapperBg.y = 0;
        wrapperBg.height = this.game.height;
        wrapperBg.width = this.game.width;


        var uipImage = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "UIP-thumb");
        uipImage.anchor.set(.5);
        uipImage.scale.setTo(.7, .7);
        uipImage.inputEnabled = true;
        uipImage.events.onInputDown.add(this.captainSafetySelect, this);

        var game2Image = this.game.add.sprite(this.game.width / 6, this.game.height / 2, "game2-thumbnail");
        game2Image.anchor.set(.5);
        game2Image.scale.setTo(.7, .7);
        game2Image.inputEnabled = true;
        game2Image.events.onInputDown.add(this.game2Start, this);



        var ngImageB = this.game.add.sprite(5 * this.game.width / 6, this.game.height / 2, "new-game-thumb");
        ngImageB.anchor.set(.5);
        ngImageB.scale.setTo(.7, .7);

        if (uipImage !== null && game2Image !== null && ngImageB !== null) {
            return true;
        } else {
            return false;
        }

    },
    /**
     * Function to start next state of game, "Preload1"
     * @method captainSafetySelect
    
     */
    captainSafetySelect: function () {

        this.game.state.start('Preload1');
    },

    //
    game2Start : function(){
        this.game.state.start('Preload2');
    }

}