//title screen for game1

var title1 = function(game) {};
var textStyle;

title1.prototype = {
    create: function() {
        var bg = this.add.sprite(1024, 768, 'title page bg');
        bg.x = 0;
        bg.y = 0;
        bg.height = this.game.height;
        bg.width = this.game.width;

        var playButton = this.game.add.sprite(226, 183, 'play button');
        playButton.x = this.game.width - 226;
        playButton.y = this.game.height - 183;
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
