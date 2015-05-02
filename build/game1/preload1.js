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
        this.game.load.image('play button', './assets/images/UIP-play-button.png');
        this.game.load.image('title page bg', './assets/images/UIP-title.jpg');
        this.game.load.image('park', './assets/images/park-bg.jpg');
        this.game.load.image('instructions', 'assets/images/instructions.jpg');
        this.game.load.image('redsquare', './assets/images/redsquare.png');
        this.game.load.audio('bad_sound', './assets/audio/bad-sound.wav', true);
		this.game.load.audio('good_sound', './assets/audio/good_sound.wav', true);
        this.game.load.spritesheet('safe', './assets/images/spritesheets/safe-biker-red.png', 80, 80);
        this.game.load.spritesheet('unsafe', './assets/images/spritesheets/unsafe-biker-red.png', 80, 80);
		this.game.load.spritesheet('safeSkate', './assets/images/spritesheets/safe-skater.png', 90, 90);
		this.game.load.spritesheet('unsafeSkate', './assets/images/spritesheets/unsafe-skater.png', 90, 90);
		this.game.load.spritesheet('safeATV', './assets/images/spritesheets/safe-atv-rider.png', 90, 90);
		this.game.load.spritesheet('unsafeATV', './assets/images/spritesheets/unsafe-atv-rider.png', 90, 90);
        this.game.load.image('replay button', './assets/images/UIP-replay-button.png');
        this.game.load.image('victory page bg', './assets/images/UIP-victory.jpg');

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