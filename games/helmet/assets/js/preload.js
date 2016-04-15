(function() {

    // Handle into preload state
    window.preload = function(game) {

    };

    window.preload.prototype = {

        preload: function() {
            this.game.load.image('title_bg', '/assets/imgs/title.jpg');
            this.game.load.image('play_button', '/assets/imgs/play-button.png');
            this.game.load.image('replay_button', '/assets/imgs/replay-button.png');

            this.game.load.audio('bad_sound', '/assets/audio/lost_life.wav', true);
            this.game.load.audio('good_sound', '/assets/audio/good_sound.wav', true);
            this.game.load.audio('game_over', '/assets/audio/game_over.wav', true);;

            this.game.load.image('bg', './assets/imgs/park_background.png');
            this.game.load.image('instructions', './assets/imgs/instructions.png');
            this.game.load.image('life', './assets/imgs/bike_life.png');
            this.game.load.image('victory page bg', './assets/imgs/victory.png');

            this.game.load.spritesheet('bike_safe', './assets/imgs/spritesheets/bike_safe.png', 108, 115);
            this.game.load.spritesheet('bike_unsafe', './assets/imgs/spritesheets/bike_unsafe.png', 108, 115);
            this.game.load.spritesheet('bike_safe_alt', './assets/imgs/spritesheets/bike_safe_alt.png', 108, 115);
            this.game.load.spritesheet('bike_unsafe_alt', './assets/imgs/spritesheets/bike_unsafe_alt.png', 108, 115);
        },

        create: function() {
            this.game.state.start("Title");
        }

    };

})();
