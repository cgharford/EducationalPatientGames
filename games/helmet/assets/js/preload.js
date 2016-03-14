(function() {

    // Handle into preload state
    window.preload = function(game) {

    };

    window.preload.prototype = {

        preload: function() {
            this.game.load.image('title page bg', '/games/lib/images/UIP-title_poss.jpg');

            this.game.load.audio('bad_sound', '/games/lib/audio/lost_life.wav', true);
            this.game.load.audio('good_sound', '/games/lib/audio/good_sound.wav', true);
            this.game.load.audio('game_over', '/games/lib/audio/game_over.wav', true);;

            this.game.load.image('play button', './assets/images/UIP-play-button.png');
            this.game.load.image('bg', './assets/images/park_background.png');
            this.game.load.image('instructions', './assets/images/instructions.png');
            this.game.load.image('life', './assets/images/bike_life.png');
            this.game.load.image('replay button', './assets/images/UIP-replay-button.png');
            this.game.load.image('victory page bg', './assets/images/UIP-victory.png');

            this.game.load.spritesheet('bike_safe', './assets/images/spritesheets/bike_safe.png', 108, 115);
            this.game.load.spritesheet('bike_unsafe', './assets/images/spritesheets/bike_unsafe.png', 108, 115);
            this.game.load.spritesheet('bike_safe_alt', './assets/images/spritesheets/bike_safe_alt.png', 108, 115);
            this.game.load.spritesheet('bike_unsafe_alt', './assets/images/spritesheets/bike_unsafe_alt.png', 108, 115);
        },

        create: function() {
            this.game.state.start("Title");
        }

    };

})();
