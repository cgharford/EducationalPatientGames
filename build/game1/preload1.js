//used to preload images for game1
var preload1 = function(game) {};

preload1.prototype = {
    preload: function() {
        this.game.load.image('play button', './assets/images/play-captain-safety.png');
        this.game.load.image('title page bg', './assets/images/captain-safety-bg.jpg');
        this.game.load.image('park', './assets/images/park-bg.jpg');
        this.game.load.image('instructions', 'assets/images/instructions.jpg');
        this.game.load.image('redsquare', './assets/images/redsquare.png');
        this.game.load.audio('bad_sound', './assets/audio/bad-sound.wav', true);
        this.game.load.spritesheet('safe', './assets/images/spritesheets/safe-biker-red.png', 80, 80);
        this.game.load.spritesheet('unsafe', './assets/images/spritesheets/unsafe-biker-red.png', 80, 80);
		this.game.load.spritesheet('safeSkate', './assets/images/spritesheets/safe-skater.png', 90, 90);
		this.game.load.spritesheet('unsafeSkate', './assets/images/spritesheets/unsafe-skater.png', 90, 90);
		this.game.load.spritesheet('safeATV', './assets/images/spritesheets/safe-atv-rider.png', 90, 90);
		this.game.load.spritesheet('unsafeATV', './assets/images/spritesheets/unsafe-atv-rider.png', 90, 90);


    },
    create: function() {
        this.game.state.add("Title1",title1);
        this.game.state.add("Game1",game1);
        this.game.state.add("Victory1",victory1);
        this.game.state.start("Title1");
    }
};