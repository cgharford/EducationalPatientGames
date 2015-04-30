module.exports = {
    create: function () {

        var victoryBg = this.add.sprite(1024, 768, 'victory page bg');
        victoryBg.x = 0;
        victoryBg.y = 0;
        victoryBg.height = this.game.height;
        victoryBg.width = this.game.width;

        var replayButton = this.game.add.sprite(513, 63, 'replay button');
        replayButton.x = this.game.width/20;
        replayButton.y = this.game.height/20;
        replayButton.inputEnabled = true;

        textStyle = {font: "48px Arial", fill: "#ffffff", align: "center"};
        yourScore = this.game.add.text(431, 172, score + " saved", textStyle);
        yourScore.visible = true;
        //yourScore.anchor.set(0.5);
        //yourScore.setText("TEST");
        //yourScore.text = "TEST";
        scores1 = this.game.add.text(700, 230, "1", textStyle);
        scores1.visible = true;
        scores2 = this.game.add.text(700, 300, "1", textStyle);
        scores2.visible = true;
        scores3 = this.game.add.text(700, 350, "1", textStyle);
        scores3.visible = true;
        scores4 = this.game.add.text(700, 420, "1", textStyle);

        try {
            this.game.globals.post("USR", score); //once users allowed to have login, will also store their username in the db
            //for now leave the userName field so it can easily scale later
            this.game.globals.get(this.game);
        }
        catch (err) {

        }

        replayButton.events.onInputDown.add(this.restart,this);
    },
    restart: function() {
        this.game.state.start('Title1');
    }
};