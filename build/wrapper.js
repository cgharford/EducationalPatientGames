//the wrapper state from which the user can select which game to play

var wrapper = function(game) {};

wrapper.prototype = {
    preload: function() {
	    //load images for all of the games here
        this.game.load.image("cs", "assets/images/captainsafety.png");
        this.game.load.image("ng", "assets/images/newgame.png");
    },
    create: function() {
        var textStyle = textStyle = {font: "50px Arial", fill: "#ffffff", align: "center", wordWrap: false};
        var instructionText = this.game.add.text(this.game.width/2,0,"Select a game to play", textStyle);
        instructionText.anchor.set(0.5,0);

        var csImage = this.game.add.sprite(this.game.width/6, this.game.height/2, "cs");
        csImage.anchor.set(.5);
        csImage.scale.setTo(.8,.8);
        csImage.inputEnabled = true;
        csImage.events.onInputDown.add(this.captainSafetySelect,this);

        var ngImageA = this.game.add.sprite(this.game.width/2, this.game.height/2, "ng");
        ngImageA.anchor.set(.5);
        ngImageA.scale.setTo(.8,.8);

        var ngImageB = this.game.add.sprite(5*this.game.width/6, this.game.height/2, "ng");
        ngImageB.anchor.set(.5);
        ngImageB.scale.setTo(.8,.8);
        
    },
    captainSafetySelect: function() {
        this.game.state.add('Preload1',preload1);
        this.game.state.start('Preload1');
    }
}