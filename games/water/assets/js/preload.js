(function() {

    // Handle into preload state
    window.preload = function(game) {

    };

    window.preload.prototype = {

        preload: function() {
            this.game.load.image('title page bg', '/games/lib/images/UIP-title_poss.jpg');

            this.game.load.image('play button', '../helmet/assets/images/UIP-play-button.png');
            this.game.load.image('replay button', '../helmet/assets/images/UIP-replay-button.png');

            this.game.load.audio('bad_sound', '/games/lib/audio/lost_life.wav', true);
            this.game.load.audio('good_sound', '/games/lib/audio/good_sound.wav', true);
            this.game.load.audio('game_over', '/games/lib/audio/game_over.wav', true);

            this.game.load.image('lake', 'assets/images/background.png');
            this.game.load.image('instructions', 'assets/images/happys_class2.png');
            this.game.load.image('victory page bg', 'assets/images/UIP-victory2.jpg');
            this.game.load.image('life', 'assets/images/life_ring.png');

            this.game.load.spritesheet('girl_boater_safe', 'assets/images/spritesheets/safe_boat_girl.png', 108, 115);
            this.game.load.spritesheet('girl_boater_unsafe', 'assets/images/spritesheets/unsafe_boat_girl.png', 108, 115);
            this.game.load.spritesheet('boy_boater_safe', 'assets/images/spritesheets/safe_boat_boy.png', 108, 115);
            this.game.load.spritesheet('boy_boater_unsafe', 'assets/images/spritesheets/unsafe_boat_boy.png', 108, 115);
        },

        create: function() {
            this.game.state.start("Title");
        }

    };

})();
