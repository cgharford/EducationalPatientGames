//game state for game1
var game1 = function(game) {
    var safeChildren;
    var unsafeChildren;
    var score;
    var scoreText;
    var errorText;
    var errorTextTimer;
    var successText;
    var successTextTimer;
    var victoryText;
    var textStyle;
};

game1.prototype = {
    create: function () {
        unsafeChildren = this.game.add.group();
        safeChildren = this.game.add.group();
        this.placeRandomChildren(unsafeChildren, 'unsafe', this.onUnsafeClick);
        this.placeRandomChildren(safeChildren, 'safe', this.onSafeClick);
        textStyle = {font: '16px Arial', fill: '#ffffff', align: 'center', wordWrap: true};
        score = 0;
        scoreText = this.game.add.text(0, 0, 'Score:' + score, {fill: '#ffffff'});
        errorText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Error that person was performing \na safe activity!',
            textStyle);
        errorText.visible = false;
        errorText.anchor.set(0.5);
        successText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Nice',
            textStyle);
        successText.visible = false;
        successText.anchor.set(0.5);
        victoryText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Congratulations you won!',
            textStyle);
        victoryText.visible = false;
        victoryText.anchor.set(0.5);
    },


    update: function () {
        scoreText.text = 'Score:' + score;
        if ((errorText.visible === true) && (this.game.time.now > errorTextTimer))
            errorText.visible = false;
        if ((successText.visible === true) && (this.game.time.now > successTextTimer))
            successText.visible = false;
        if (unsafeChildren.countLiving() === 0)
            this.victory();

    },

    onSafeClick: function (sprite) {
        score -= 1;
        successText.visible = false;
        errorTextTimer = this.game.time.now + 500; //error text will be displayed for 500 ms when a safe child is clicked
        errorText.visible = true;

    },

    onUnsafeClick: function (sprite) {
        score += 1;
        var safeChild = safeChildren.create(sprite.position.x, sprite.position.y, 'safe');
        safeChild.inputEnabled = true;
        safeChild.events.onInputDown.add(this.onSafeClick, this);
        safeChild.scale.x = 0.25;
        safeChild.scale.y = 0.25;
        safeChild.outOfBoundsKill = true;
        sprite.kill(); //todo: implement a sprite recycling mechanism with some maximum amount of safe and unsafe sprites visible at a time
        errorText.visible = false;
        successTextTimer = this.game.time.now + 500;
        successText.visible = true;
    },

    victory: function () {
        safeChildren.forEach(function (child) {
            child.kill();
        });
        errorText.visible = false;
        successText.visible = false;
        victoryText.visible = true;
        this.game.state.start("Victory1",true,false);
    },

    placeRandomChildren: function (group, spriteName, listener) {
        for (var i = 0; i < 3; i++) {
            var child = group.create(this.game.world.randomX, this.game.world.randomY, spriteName);
            child.inputEnabled = true;
            child.events.onInputDown.add(listener, this);
        }
        group.setAll('scale.x', 0.25);
        group.setAll('scale.y', 0.25);
        group.setAll('outOfBoundsKill', true);
    }
}