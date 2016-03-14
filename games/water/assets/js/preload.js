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
            this.game.load.audio('game_over', '/assets/audio/game_over.wav', true);

            this.game.load.image('lake', './assets/imgs/background.png');
            this.game.load.image('instructions', './assets/imgs/happys_class2.png');
            this.game.load.image('victory', './assets/imgs/victory.jpg');
            this.game.load.image('life', './assets/imgs/life_ring.png');

            this.game.load.spritesheet('girl_boater_safe', './assets/imgs/spritesheets/safe_boat_girl.png', 108, 115);
            this.game.load.spritesheet('girl_boater_unsafe', './assets/imgs/spritesheets/unsafe_boat_girl.png', 108, 115);
            this.game.load.spritesheet('boy_boater_safe', './assets/imgs/spritesheets/safe_boat_boy.png', 108, 115);
            this.game.load.spritesheet('boy_boater_unsafe', './assets/imgs/spritesheets/unsafe_boat_boy.png', 108, 115);
        },

        create: function() {
            this.game.state.start("Title");
        }

    };

})();
