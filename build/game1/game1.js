//game state for game1
var game1 = function(game) {};
//var child;
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
game1.prototype = {
    create: function () {
        unsafeChildren = this.game.add.group();
        safeChildren = this.game.add.group();

		//this.placeRandomChildren(unsafeChildren, 'unsafe', this.onUnsafeClick);
        //this.placeRandomChildren(safeChildren, 'safe', this.onSafeClick);
		//Note: current victory conditions require that some unsafe children be created on load or instant win will occur, so that's these
        this.createChild(250, 250, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
        this.createChild(75, 75, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
        this.createChild(200, 200, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);

        this.startSpawn(2, this.game.width, 150, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
        this.startSpawn(4, this.game.width, 250, "left", safeChildren, 'safe', this.onSafeClick);
		this.startSpawn(7, this.game.width, 50, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);

        //This will allow to check num of living unsafe children to see if offscreen are killed
        //this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.announceLiving);

        textStyle = {font: '16px Arial', fill: '#ffffff', align: 'center', wordWrap: true};
        score = 0;
        scoreText = this.game.add.text(0, 0, 'Score:' + score, {fill: '#ffffff'});
        errorText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'That person was performing \na safe activity!',
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

       // child.animations.play('ride');

        scoreText.text = 'Score:' + score;
        if ((errorText.visible === true) && (this.game.time.now > errorTextTimer))
            errorText.visible = false;
        if ((successText.visible === true) && (this.game.time.now > successTextTimer))
            successText.visible = false;
        if (unsafeChildren.countLiving() === 0)
            this.victory();

        //Trying out movement stuff

        for (var i = 0; i < unsafeChildren.children.length; i++) {
            var currentChild = unsafeChildren.children[i];
            if (currentChild.alive){
                currentChild.move();
                currentChild.animations.play('ride');

            }
            if (currentChild.position.x > this.game.width || currentChild.position.x < 0 || currentChild.position.y > this.game.height || currentChild.position.y < 0){
                currentChild.kill();
                //weird stuff still happening with killing offscreen?
            }

            /*
            if (Math.random() > .99) {
                this.changeDirection(currentChild);
            }
           */

        }
        for (var i = 0; i < safeChildren.children.length; i++) {
            var currentChild = safeChildren.children[i];
            if (currentChild.alive){
                currentChild.move();
                currentChild.animations.play('ride');

            }
            if (currentChild.position.x > this.game.width || currentChild.position.x < 0 || currentChild.position.y > this.game.height || currentChild.position.y < 0){
                currentChild.kill(); //weird stuff still happening with killing offscreen?
            }
            /*
            if (Math.random() > .98) {
                this.changeDirection(currentChild);
            }
            */

        }

    },
    onSafeClick: function (sprite) {
        score -= 1;
        successText.visible = false;
        errorTextTimer = this.game.time.now + 500; //error text will be displayed for 500 ms when a safe child is clicked
        errorText.position.x = sprite.position.x;
        errorText.position.y = sprite.position.y + sprite.height;
        errorText.visible = true;
    },
    onUnsafeClick: function (sprite) {
        score += 1;
        /*
        var safeChild = safeChildren.create(0, 0, 'safe'); //place at (0,0) first so the anchor can be set before placement
        safeChild.inputEnabled = true;
        safeChild.events.onInputDown.add(this.onSafeClick, this);
        safeChild.scale.x = 0.25;
        safeChild.scale.y = 0.25;
        safeChild.anchor.set(0.5);
        safeChild.position.x = sprite.position.x;
        safeChild.position.y = sprite.position.y;
        safeChild.outOfBoundsKill = true;*/
        this.createChild(sprite.position.x, sprite.position.y, sprite.direction, safeChildren, 'safe', this.onSafeClick);

        sprite.kill(); //todo: implement a sprite recycling mechanism with some maximum amount of safe and unsafe sprites visible at a time
        errorText.visible = false;
        successTextTimer = this.game.time.now + 500;
        successText.position.x = safeChild.position.x;
        successText.position.y = safeChild.position.y + safeChild.height;
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
            child = group.create(0, 0, spriteName);
            child.inputEnabled = true;
            child.events.onInputDown.add(listener, this);
            child.anchor.set(0.5);
            child.position.x = this.game.world.randomX;
            child.position.y = this.game.world.randomY;
            child.animations.add('ride', [0, 1, 2, 3, 4], 4, true);
        }
        group.setAll('scale.x', 0.25);
        group.setAll('scale.y', 0.25);
        group.setAll('outOfBoundsKill', true);
    },

    startSpawn: function (timeDelay, x, y, direction, group, spriteName, listener) {
        var delayTime = Phaser.Timer.SECOND * timeDelay;
        this.game.time.events.loop(delayTime, this.createChild,this, x, y, direction, group, spriteName, listener);

    },
    createChild: function (startx, starty, direction, group, spriteName, listener) {
        var child;
        child = group.create(0, 0, spriteName);
        child.inputEnabled = true;
        child.events.onInputDown.add(listener, this);
        child.anchor.set(0.5);
        child.position.x = startx;
        child.position.y = starty;
        child.direction = direction;
        child.scale.x = .25;
        child.scale.y = .25;

        child.checkWorldBounds = true;
        child.outOfBoundsKill = true;        //Not sure if outOfBoundsKill is doing it's job
        child.animations.add('ride', [0, 1, 2, 3, 4], 4, true);

        child.move = function () {
            if (this.direction === "up") {
                this.position.y--;
            }
            else if (this.direction === "down") {
                this.position.y++;
            }
            else if (this.direction === "left") {
                this.position.x--;
            }
            else if (this.direction === "right") {
                this.position.x++;
            }
			
        };
        //group.setAll('scale.x', 0.25);
        //group.setAll('scale.y', 0.25);
        //group.setAll('outOfBoundsKill', true);
    },

    //NOTE: Since sprites die offscreen I don't worry about them randomly going off screen.
    //TODO: plan to plot movement along background instead of random movement, random movement just for demo purposes
    changeDirection: function(sprite){
        var randNum = Math.round(Math.random() * (100));
        if (randNum < 25){
            sprite.direction = "left";
        }
        else if (randNum < 50){
            sprite.direction = "right";
        }
        else if (randNum < 75){
            sprite.direction = "up";
        }
        else{
            sprite.direction = "down";

        }
    },

    //Function I was using to check what unsafe children were still alive to monitor killing the offscreen children
    announceLiving: function(){
        alert(this.unsafeChildren.countLiving());
    }


};