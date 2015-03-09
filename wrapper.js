//the wrapper state from which the user can select which game to play

var wrapper = function(game) {};

wrapper.prototype = {
    preload: function() {
        //load images for all of the games here
    },
    create: function() {
        var textStyle = textStyle = {font: "12px Arial", fill: "#ffffff", align: "center", wordWrap: true};
        var instructionText = this.game.add.text(this.game.width/2,0,"Select a game to play", textStyle);
        instructionText.anchor.set(0.5,0);
        var captainSafetyText = this.game.add.text(this.game.width/2,1.2*instructionText.height,'Captain Safety', textStyle);
        captainSafetyText.anchor.set(0.5);
        captainSafetyText.inputEnabled = true;
        captainSafetyText.events.onInputDown.add(this.captainSafetySelect,this);
    },
    captainSafetySelect: function() {
        this.game.state.add('Preload1',preload1);
        this.game.state.start('Preload1');
    }
}