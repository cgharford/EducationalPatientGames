module.exports = {
    create: function() {
        var titleBg = this.add.sprite(1024, 768, 'title page bg');
        titleBg.x = 0;
        titleBg.y = 0;
        titleBg.height = this.game.height;
        titleBg.width = this.game.width;

        var playButton = this.game.add.sprite(319, 160, 'play button');
        playButton.x = this.game.width - 319;
        playButton.y = this.game.height - 160;
        playButton.inputEnabled = true;
        //var playButton = this.game.add.button(this.game.width/2,this.game.height/2 + titleText.height, 'play button',
        //    this.playGame(),this);
        //playButton.anchor.set(0.5);
        playButton.events.onInputDown.add(this.playGame,this);

        /*
        textStyle = {font: "48px Arial", fill: "#ffffff", align: "center"};

        var titleText = this.game.add.text(this.game.width/2,this.game.height/2,"Captain Safety",
            textStyle);
        titleText.anchor.set(0.5);
        titleText.visible = true;
        */
    },
    playGame: function() {
        this.game.state.start("Game1");
    }
};
