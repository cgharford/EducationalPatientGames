//the wrapper state from which the user can select which game to play

var wrapper = function(game) {};

wrapper.prototype = {
    preload: function() {
	    //load images for all of the games here
        this.game.load.image("wrapper-bg", "assets/images/wrapper.jpg");
        this.game.load.image("new-game-thumb", "assets/images/new-game-thumbnail.jpg");
        this.game.load.image("UIP-thumb", "assets/images/UIP-thumbnail.jpg");
    },
    create: function() {
        
        wrapperBg = this.add.sprite(1024, 768, 'wrapper-bg');
        wrapperBg.x = 0;
        wrapperBg.y = 0;
        wrapperBg.height = this.game.height;
        wrapperBg.width = this.game.width;


        var uipImage = this.game.add.sprite(this.game.width/2, this.game.height/2, "UIP-thumb");
        uipImage.anchor.set(.5);
        //uipImage.scale.setTo(.8,.8);
        uipImage.inputEnabled = true;
        uipImage.events.onInputDown.add(this.captainSafetySelect,this);

        var ngImageA = this.game.add.sprite(this.game.width/6, this.game.height/2, "new-game-thumb");
        ngImageA.anchor.set(.5);
        //ngImageA.scale.setTo(.8,.8);


        var ngImageB = this.game.add.sprite(5*this.game.width/6, this.game.height/2, "new-game-thumb");
        ngImageB.anchor.set(.5);
        //ngImageB.scale.setTo(.8,.8);

        if(uipImage !== null && ngImageA !== null && ngImageB !== null){
            return true;
        } else {
            return false;
        }
        
    },
    captainSafetySelect: function() {
        this.game.state.add('Preload1',preload1);
        this.game.state.start('Preload1');
    }
}