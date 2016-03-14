module.exports = {
	  /**
  *preload1 class. The preload object, first state of the game, preloads all necessary assets
  
  *@class preload1
  
  */
  
     /**
     * phaser preload function  -- loads in all necessary assets (images, sprites, spritesheets, audio) for use in the other game states
     * @method preload
     *   
     */
    preload: function() {
        this.game.load.image('play button', './assets/game1/images/UIP-play-button.png');
        this.game.load.image('title page bg',  './assets/general/images/UIP-title_poss.jpeg');
        this.game.load.image('bg', './assets/game1/images/park_background.png');
        this.game.load.image('instructions', './assets/game1/images/instructions.png');
        this.game.load.audio('bad_sound', './assets/general/audio/lost_life.wav', true);
        this.game.load.audio('good_sound', './assets/general/audio/good_sound.wav', true);
        this.game.load.audio('game_over', './assets/general/audio/game_over.wav', true);;
        this.game.load.spritesheet('bike_safe', './assets/game1/images/spritesheets/bike_safe.png', 108, 115);
        this.game.load.spritesheet('bike_unsafe', './assets/game1/images/spritesheets/bike_unsafe.png', 108, 115);
        this.game.load.spritesheet('bike_safe_alt', './assets/game1/images/spritesheets/bike_safe_alt.png', 108, 115);
        this.game.load.spritesheet('bike_unsafe_alt', './assets/game1/images/spritesheets/bike_unsafe_alt.png', 108, 115);
        this.game.load.image('replay button', './assets/game1/images/UIP-replay-button.png');
        this.game.load.image('victory page bg', './assets/game1/images/UIP-victory.png');
        this.game.load.image('life', './assets/game1/images/bike_life.png');

    },
	
	   /**
     * phaser create function  -- loads next state, the title screen
     * @method create
     *   
     */
    create: function() {
        this.game.state.start("Title1");
    }
};