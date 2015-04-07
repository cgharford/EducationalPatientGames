//game state for game1
var game1 = function(game) {};
//var child;
var safeChildren;
var unsafeChildren;
var directionShifters;
var score;
var scoreText;
var bad_sound;
var errorText;
var errorTextTimer;
var successText;
var successTextTimer;
var victoryText;
var textStyle;
game1.prototype = {
    create: function () {

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var park = this.add.sprite(1024, 768, 'park');
        park.x = 0;
        park.y = 0;
		park.height = this.game.height;
        park.width = this.game.width;
        unsafeChildren = this.game.add.group();
        safeChildren = this.game.add.group();
		directionShifters = this.game.add.group();
		
		

		//this.placeRandomChildren(unsafeChildren, 'unsafe', this.onUnsafeClick);
        //this.placeRandomChildren(safeChildren, 'safe', this.onSafeClick);
		//Note: current victory conditions require that some unsafe children be created on load or instant win will occur, so that's these
       // this.createChild(250, 250, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
       // this.createChild(75, 75, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
       // this.createChild(200, 200, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);

		//We can create spawn points wherever we want so the sprites start on paths etc.
        //this.startSpawn(2, this.game.width, 150, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
       // this.startSpawn(4, this.game.width, 250, "left", safeChildren, 'safe', this.onSafeClick);
		//this.startSpawn(7, this.game.width, 50, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
		this.createChild(this.game.width, (this.game.height/8), "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
		this.startSpawn(6, this.game.width, (this.game.height/8), "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
		this.startSpawn(4, 0, (this.game.height/4), "down-right", unsafeChildren, 'unsafe', this.onUnsafeClick);
		this.createShifter(13 * (this.game.width/14), this.game.height/8, "down");
		this.createShifter(13 * (this.game.width / 14), 17 * this.game.height/18, "left");
		this.createShifter(this.game.width/5, 4 * this.game.height/8, "right");
		this.createShifter(4*this.game.width/9, 4 * this.game.height/8, "up-right");
		this.createShifter(7*this.game.width/11, this.game.height/4, "up-left");
		
		//this.createShifter(this.game.width-100, 150, "down");
		
		//this.createShifter(this.game.width-100, 750, "left");
        //This will allow to check num of living unsafe children to see if offscreen are killed
        //this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.announceLiving);

        bad_sound = this.add.audio('bad_sound');

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
        	if(this.cache.isSoundDecoded('bad_sound') && this.ready === false) {

            this.game.physics.arcade.overlap(unsafeChildren, directionShifters, this.shiftDirection);
            this.game.physics.arcade.overlap(safeChildren, directionShifters, this.shiftDirection);

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
                if (currentChild.alive) {
                    currentChild.move();
                    currentChild.animations.play('ride');

                }
                if (currentChild.position.x > this.game.width || currentChild.position.x < 0 || currentChild.position.y > this.game.height || currentChild.position.y < 0) {
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
                if (currentChild.alive) {
                    currentChild.move();
                    currentChild.animations.play('ride');

                }
                if (currentChild.position.x > this.game.width || currentChild.position.x < 0 || currentChild.position.y > this.game.height || currentChild.position.y < 0) {
                    currentChild.kill(); //weird stuff still happening with killing offscreen?
                }
                /*
                 if (Math.random() > .98) {
                 this.changeDirection(currentChild);
                 }
                 */

            }
        }
    },
    onSafeClick: function (sprite) {
        score -= 1;
        successText.visible = false;
        errorTextTimer = this.game.time.now + 500; //error text will be displayed for 500 ms when a safe child is clicked
        errorText.position.x = sprite.position.x;
        errorText.position.y = sprite.position.y + sprite.height;
        errorText.visible = true;
        bad_sound.play();

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
        //group.setAll('scale.x', 0.25);
        //group.setAll('scale.y', 0.25);
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
        //child.scale.x = .25;
        //child.scale.y = .25;
		this.game.physics.enable(child, Phaser.Physics.ARCADE, true);
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
			
			else if (this.direction == "up-right"){
				this.position.x++;
				this.position.y--;
			}
			
			else if (this.direction == "up-left"){
				this.position.x--;
				this.position.y--;
			
			}
			
			else if (this.direction == "down-left"){
				this.position.x--;
				this.position.y++;
			}
			
			else if (this.direction == "down-right"){
				this.position.x++;
				this.position.y++;
				
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
	
	createShifter : function(x, y, newDirection) {
		shifter = directionShifters.create(0, 0);
		shifter.anchor.set(.5);
		shifter.position.x = x;
		shifter.position.y = y;
		shifter.direction = newDirection;
		this.game.physics.enable(shifter, Phaser.Physics.ARCADE, true);

	},
	
	shiftDirection : function(sprite, shifter){
		sprite.direction = shifter.direction;
		
	},
		
    //Function I was using to check what unsafe children were still alive to monitor killing the offscreen children
    announceLiving: function(){
        alert(this.unsafeChildren.countLiving());
    }


};