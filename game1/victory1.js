var victory1 = function(game) {};
var victoryText;
var textStyle;

victory1.prototype = {
    create: function () {
        textStyle = {font: "48px Arial", fill: "#ffffff", align: "center"};
        victoryText = this.game.add.text(this.game.width/2, this.game.height/2, "Nice job, you won \nClick to restart",
            textStyle);
        victoryText.visible = true;
        victoryText.anchor.set(0.5);
        this.game.input.onDown.add(this.restart, this);
    },
    restart: function() {
        this.game.state.start('Title1');
    }
}