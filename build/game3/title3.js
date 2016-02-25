module.exports = {
	  /**
  *title2 class. The title1 object, just displays title screen

  *@class title3
  */

     /**
     * phaser create function  -- initializes the title state, displays title screen and play button.
     * @method create
     * @return
     */
    create: function() {
        var titleBg = this.add.sprite(this.game.width, this.game.height, 'title page bg');
        titleBg.x = 0;
        titleBg.y = 0;
        titleBg.height = this.game.height;
        titleBg.width = this.game.width;
        //load and play blackground music
/*        background_music = this.add.audio('background_music');
        background_music.play();*/

        //create a play button
        var playButton = this.game.add.sprite(319, 160, 'play button');
        playButton.x = this.game.width - 319;
        playButton.y = this.game.height - 160;
        playButton.inputEnabled = true;

        playButton.events.onInputDown.add(this.playGame,this);


    },

	   /**
     * playGame function that begins the gameplay state Game1
     * @method playGame
     * @return
     */
    playGame: function() {
        this.game.state.start("Game3");
    }
};
