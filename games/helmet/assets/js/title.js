(function() {

    // Handle into title state
    window.title = function(game) {

    };

    window.title.prototype = {

        create: function() {
            var titleBg = this.add.sprite(this.game.width, this.game.height, 'title_bg');
            titleBg.x = 0;
            titleBg.y = 0;
            titleBg.height = this.game.height;
            titleBg.width = this.game.width;

            var playButton = this.game.add.sprite(319, 160, 'play_button');
            playButton.x = this.game.width - 319;
            playButton.y = this.game.height - 160;
            playButton.inputEnabled = true;
            playButton.events.onInputDown.add(function() {
                this.game.state.start("Main");
            }, this);
        }

    };

})();
