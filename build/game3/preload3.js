module.exports = {
	  /**
  *preload2 class. The preload object, first state of the game, preloads all necessary assets

  *@class preload3

  */

     /**
     * phaser preload function  -- loads in all necessary assets (images, sprites, spritesheets, audio) for use in the other game states
     * @method preload
     *
     */
    preload: function() {
        this.game.load.image('play button', './assets/game1/images/UIP-play-button.png');
        this.game.load.image('title page bg', './assets/general/images/UIP-title_poss.jpeg');
        this.game.load.image('lake', './assets/game2/images/background.png');
        this.game.load.image('instructions', './assets/game2/images/happys_class2.png');
        this.game.load.audio('bad_sound', './assets/general/audio/lost_life.wav', true);
        this.game.load.audio('good_sound', './assets/general/audio/good_sound.wav', true);
        this.game.load.audio('game_over', './assets/general/audio/game_over.wav', true);
        this.game.load.spritesheet('girl_boater_safe', './assets/game2/images/spritesheets/safe_boat_girl.png', 108, 115);
        this.game.load.spritesheet('girl_boater_unsafe', './assets/game2/images/spritesheets/unsafe_boat_girl.png', 108, 115);
        this.game.load.spritesheet('boy_boater_safe', './assets/game2/images/spritesheets/safe_boat_boy.png', 108, 115);
        this.game.load.spritesheet('boy_boater_unsafe', './assets/game2/images/spritesheets/unsafe_boat_boy.png', 108, 115);
        this.game.load.image('replay button', './assets/game1/images/UIP-replay-button.png');
        this.game.load.image('victory page bg', './assets/game2/images/UIP-victory2.jpg');
        this.game.load.image('life', './assets/game2/images/life_ring.png');
    },

	   /**
     * phaser create function  -- loads next state, the title screen
     * @method create
     *
     */
    create: function() {
        this.game.state.start("Title3");
    }
};
