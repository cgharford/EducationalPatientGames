//title screen for game1

var title1 = function(game) {
    var textStyle;
};

//todo: for some reason it doesn't pause and wait for play button to be clicked
title1.prototype = {
    create: function() {
        textStyle = {font: "48px Arial", fill: "#ffffff", align: "center"};
        var titleText = this.game.add.text(this.game.width/2,this.game.height/2,"Captain Safety",
            textStyle);
        titleText.anchor.set(0.5);
        titleText.visible = true;
        var playButton = this.game.add.button(this.game.width/2,this.game.height/2 + titleText.height, 'play button',
            this.playGame(),this);
        playButton.anchor.set(0.5);
    },
    playGame: function() {
        this.game.state.start("Game1");
    }
};
