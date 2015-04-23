//game state for game1
var game1 = function(game) {};

var park,
    safeChildren,
    unsafeChildren,
    directionShifters,
    textStyle,
    score,
    scoreText,
    errorText,
    errorTextTimer,
    successText,
    successTextTimer,
    timeRemaining,
	firstRateIncrease,
	secondRateIncrease,
	maxTime,
    clockText,
    pause,
    instructions,
    bad_sound,
    victoryText;

game1.prototype = {
    create: function () {

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		firstRateIncrease = false;
		secondRateIncrease = false;
        //Add background
        park = this.add.sprite(1024, 768, 'park');
        park.x = 0;
        park.y = 0;
		park.height = this.game.height;
        park.width = this.game.width;

        //Create children group and invisible collision objects group
        unsafeChildren = this.game.add.group();
        safeChildren = this.game.add.group();
		directionShifters = this.game.add.group();
		
		//this.createChild(350,350, "left", unsafeChildren, 'safeSkate', this.onUnsafeClick);
		
        /*
		this.placeRandomChildren(unsafeChildren, 'unsafe', this.onUnsafeClick);
        this.placeRandomChildren(safeChildren, 'safe', this.onSafeClick);
		
        Note: current victory conditions require that some unsafe children be created on load or instant win will occur, so that's these
        this.createChild(250, 250, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
        this.createChild(75, 75, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
        this.createChild(200, 200, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
        

		We can create spawn points wherever we want so the sprites start on paths etc.
        this.startSpawn(2, this.game.width, 150, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
        this.startSpawn(4, this.game.width, 250, "left", safeChildren, 'safe', this.onSafeClick);
		this.startSpawn(7, this.game.width, 50, "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
        */

		this.createChild(this.game.width, (this.game.height/8), "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
		//this.startSpawn(6, this.game.width, (this.game.height/8), "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
		//this.startSpawn(4, 0, (this.game.height/4), "down-right", unsafeChildren, 'unsafe', this.onUnsafeClick
		this.startSpawn(6, this.game.width, (this.game.height/8), "left");		
		this.startSpawn(3, 0, (this.game.height/4), "down-right")
		this.createShifter(11 * (this.game.width/12), this.game.height/8, "down", false);
		this.createShifter(11 * (this.game.width / 12), 23 * this.game.height/24, "left", false);
		this.createShifter(this.game.width/7, 5 * this.game.height/9, "right", false);
		this.createShifter(5*this.game.width/9, 4 * this.game.height/8, "up-right", false);
		this.createShifter(7*this.game.width/11, this.game.height/7, "up-left", true);
		this.createShifter(2 * (this.game.width / 12), 23 * this.game.height/24, "left", true);
		
        /*
		this.createShifter(this.game.width-100, 150, "down");
		this.createShifter(this.game.width-100, 750, "left");
        This will allow to check num of living unsafe children to see if offscreen are killed
        this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.announceLiving);
        */

        // Add funky negative sound
        bad_sound = this.add.audio('bad_sound');

        // Score starts at 0, timer starts at 60 seconds
        score = 0;
        timeRemaining = 60;
		maxTime = timeRemaining
        textStyle = {font: '30px Arial', fill: '#ffffff', align: 'center', wordWrap: true};

        // Add error message
        errorText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'That person was performing \na safe activity!', textStyle);
        errorText.visible = false;
        errorText.anchor.set(0.5);

        // Add success message
        successText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Nice', textStyle);
        successText.visible = false;
        successText.anchor.set(0.5);

        //  Place score and timer in lower left hand corner
        scoreText = this.game.add.text(20, this.game.height - 50, 'Score: ' + score, {fill: '#ffffff'});
        clockText = this.game.add.text(this.game.width/20 + errorText.width, this.game.height - 50, 'Time Remaining: ' + timeRemaining, {fill: '#ffffff'});
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

        // Allow game to be paused
        pause = this.game.add.text(errorText.width + clockText.width*2, this.game.height - 50, "Pause", {fill: '#ffffff'});
        pause.inputEnabled = true;
        pause.events.onInputDown.add(this.pauseGame, this);

        instructions = this.add.image((this.game.width / 2) - 1024/2, (this.game.height / 2) - 768/2, 'instructions');
        instructions.visible = false;

        // Click anywhere to unpause
        this.game.input.onDown.add(this.unpauseGame, this);

        // On time out, show score
		victoryText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Congratulations your score is ' + score + '!', textStyle);
		victoryText.visible = false;
        victoryText.anchor.set(0.5);
    },

    pauseGame: function(){
        this.game.paused = true;
        instructions.visible = true;

    },
    unpauseGame: function(){
        this.game.paused = false;
        instructions.visible = false;

    },

    update: function () {
	
			if (timeRemaining == (2 * (maxTime / 3)) && firstRateIncrease == false){
				bad_sound.play();
				this.startSpawn(3, this.game.width, (this.game.height/8), "left");		
				this.startSpawn(3, 0, (this.game.height/4), "down-right");
				
				firstRateIncrease = true;
			}
			
			if (timeRemaining == (maxTime / 3) && secondRateIncrease == false){
				bad_sound.play();
				this.startSpawn(3, this.game.width, (this.game.height/8), "left");		
				this.startSpawn(3, 0, (this.game.height/4), "down-right");
				secondRateIncrease = true;
				
			}
			
			if (timeRemaining <= (maxTime / 3)){
				for (var i = 0; i < unsafeChildren.children.length; i++) {
				unsafeChildren.children[i].velocity = 3;
				}
				for (var i = 0; i < safeChildren.children.length; i++) {
				safeChildren.children[i].velocity = 3;
			}
			}
			
			else if (timeRemaining <= (2 * (maxTime / 3))){
				for (var i = 0; i < unsafeChildren.children.length; i++) {
				unsafeChildren.children[i].velocity = 2;
				
			}
			for (var i = 0; i < safeChildren.children.length; i++) {
				safeChildren.children[i].velocity = 2;
			}
			}
			
		
            // On overlap of children and invisible objects (function) shift direction
            this.game.physics.arcade.overlap(unsafeChildren, directionShifters, this.shiftDirection);
            this.game.physics.arcade.overlap(safeChildren, directionShifters, this.shiftDirection);
            
            // Update score, timer, and victory texts with new values
            scoreText.text = 'Score: ' + score;
			clockText.text = 'Time Remaining: ' + timeRemaining;
			victoryText.text = 'Congratulations your score is ' + score + '!'
		
            // If error/success text were visible for 500ms, hide them
            if ((errorText.visible === true) && (this.game.time.now > errorTextTimer))
                errorText.visible = false;
            if ((successText.visible === true) && (this.game.time.now > successTextTimer))
                successText.visible = false;

            // If timer runs out, show victory		
			if (timeRemaining <= 0){
				this.victory();
			}

            // For each child alive, move and animate
            // For each child off screen, kill sprite
            for (var i = 0; i < unsafeChildren.children.length; i++) {
                var currentChild = unsafeChildren.children[i];
                if (currentChild.alive) {
                    currentChild.move();
                    currentChild.animations.play('ride');

                }
                
                if (currentChild.position.x > this.game.width || currentChild.position.x < 0 || currentChild.position.y > this.game.height || currentChild.position.y < 0) {
                    currentChild.kill();
                }

                /*
                 if (Math.random() > .99) {
                 this.changeDirection(currentChild);
                 }
                 */

            }
            // For each child alive, move and animate
            // For each child off screen, kill sprite
            for (var i = 0; i < safeChildren.children.length; i++) {
                var currentChild = safeChildren.children[i];
                if (currentChild.alive) {
                    currentChild.move();
                    currentChild.animations.play('ride');

                }
                // Weird stuff happening with killing off screen
                if (currentChild.position.x > this.game.width || currentChild.position.x < 0 || currentChild.position.y > this.game.height || currentChild.position.y < 0) {
                    currentChild.kill(); //weird stuff still happening with killing offscreen?
                }

                /*
                 if (Math.random() > .98) {
                 this.changeDirection(currentChild);
                 }
                 */
            }   
    },

    // Clicking a sprite being safe
    onSafeClick: function (sprite) {

        // Decrement score
        if (score > 0){
			score -= 1;
		}

        // Play error sound -- REMOVED DUE TO NO NEGATIVE FEEDBACK REQUEST FROM CLIENT
       // bad_sound.play();

        // Place error msg at sprite for 500ms and set to visible
        errorText.position.x = sprite.position.x;
        errorText.position.y = sprite.position.y + sprite.height;
        errorTextTimer = this.game.time.now + 500;
        errorText.visible = true;
        successText.visible = false;

    },

    // Clicking a sprite being unsafe
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
		var safeChild;
		var newImage;
		if (sprite.key == 'unsafe')
			newImage = 'safe'
		else if (sprite.key == 'unsafeSkate')
			newImage = 'safeSkate';
		else if (sprite.key == 'unsafeATV')
			newImage = 'safeATV';
		safeChild = this.createChild(sprite.position.x, sprite.position.y, sprite.direction, safeChildren, newImage, this.onSafeClick);
		errorText.visible = false;
		successTextTimer = this.game.time.now + 500;
		successText.position.x = sprite.position.x;
		successText.position.y = sprite.position.y;
		successText.visible = true;
        sprite.kill(); //todo: implement a sprite recycling mechanism with some maximum amount of safe and unsafe sprites visible at a time
       // errorText.visible = false;
        //successTextTimer = this.game.time.now + 500;
       // successText.position.x = safeChild.position.x;
       // successText.position.y = safeChild.position.y + safeChild.height;
       // successText.visible = true;
    },
    victory: function () {
        safeChildren.forEach(function (child) {
            child.kill();
        });
        errorText.visible = false;
        successText.visible = false;
        victoryText.visible = true;
        this.game.state.start("Victory1",true,false, score);
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

    //startSpawn: function (timeDelay, x, y, direction, group, spriteName, listener) {
	startSpawn: function (timeDelay, x, y, direction) {
        var delayTime = Phaser.Timer.SECOND * timeDelay;
		//var newSprite = null;
		
        this.game.time.events.loop(delayTime, this.createRandomChild,this, x, y, direction);

    },
	
	updateTime: function(){
		timeRemaining-= 1;
	},
	
	
	createRandomChild: function (startx, starty, direction){
		var group;
		var spriteName;
		var listener;
		var randomNum = Math.random();
		if (randomNum > .35){
			
			group = unsafeChildren;
			if (randomNum > .5 && randomNum < .7){
				spriteName = 'unsafe';
			} else if(randomNum > .7){
				spriteName = 'unsafeSkate';
			} else {
				spriteName = 'unsafeATV';
			}
			listener = this.onUnsafeClick;
		}
		else {
			
			group = safeChildren;
			if (randomNum > .5 && randomNum < .7){
				spriteName = 'safe';
			} else if(randomNum > .7){
				spriteName = 'safeSkate';
			} else {
				spriteName = 'safeATV';
			}
			listener = this.onSafeClick;
		}
		
		 this.createChild(startx, starty, direction, group, spriteName, listener);
		
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
		child.safe = false;
		if (spriteName == 'safeSkate' || spriteName == 'safe' || spriteName == 'safeATV'){
			child.safe = true;
		}
		if (child.direction == "right" || child.direction == "down-right"  || child.direction == "up-right")
			child.scale.x = child.scale.x * -1;
        //child.scale.x = .25;
        //child.scale.y = .25;
		this.game.physics.enable(child, Phaser.Physics.ARCADE, true);
        child.checkWorldBounds = true;
        child.outOfBoundsKill = true;    
		if (spriteName == 'safe' || spriteName == 'unsafe'){
			//name, frames, fps, boolean for loop (true means plays more than once)
			child.animations.add('ride', [0, 1, 2, 3, 4], 4, true);
		}
		else if (spriteName == 'safeSkate' || spriteName == 'unsafeSkate'){
			child.scale.x = child.scale.x * -1;
			child.animations.add('ride', [0, 1, 2, 3, 4, 5], 5, true);
		}
		else if (spriteName == 'safeATV' || spriteName == 'unsafeATV'){
			child.scale.x = child.scale.x * -1;
			child.animations.add('ride', [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
		}
		
		child.velocity = 1;
		
		child.flashRed = function() {
			//child.animations.tint = 0xff0000;
			child.tint = 0xff0000;
		};
		
		child.restoreColor = function() {
			//child.animations.tint = 0xFFFFFF;
			child.tint = 0xFFFFFF;
		};
		
		child.startRed = function(){
		//this.game.time.events.repeat(100, 5,  child.flashRed, this);
		//this.game.time.events.repeat(150, 5, child.restoreColor, this);
		child.flashRed();
		//this.game.time.events.loop(100, child.flashRed, this);
		//this.game.time.events.loop(150, child.restoreColor, this);
		// this.game.time.events.add(300, child.restoreColor, this);
		
		};
        child.move = function () {
						
			if (this.direction === "up") {
                this.position.y-= this.velocity;
            }
            else if (this.direction === "down") {
                this.position.y += this.velocity;
            }
            else if (this.direction === "left") {
                this.position.x -= this.velocity;
            }
            else if (this.direction === "right") {
                this.position.x += this.velocity;
            }
			
			else if (this.direction == "up-right"){
				this.position.x+= this.velocity;
				this.position.y-= this.velocity;
			}
			
			else if (this.direction == "up-left"){
				this.position.x -= this.velocity;
				this.position.y-= this.velocity;
			
			}
			
			else if (this.direction == "down-left"){
				this.position.x-= this.velocity;
				this.position.y+= this.velocity;
			}
			
			else if (this.direction == "down-right"){
				this.position.x+= this.velocity;
				this.position.y+= this.velocity;
				
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
	
	createShifter : function(x, y, newDirection, warning) {
		shifter = directionShifters.create(0, 0, "redsquare");
		shifter.visible = false;
		shifter.warningFlag = warning;
		shifter.width = window.innerWidth * window.devicePixelRatio * .0004;
		shifter.height = (window.innerWidth * window.devicePixelRatio * .0004);
		shifter.anchor.set(.5);
		shifter.position.x = x;
		shifter.position.y = y;
		shifter.direction = newDirection;
		shifter.scale.x = (window.innerWidth * window.devicePixelRatio * .0004);
		shifter.scale.y = (window.innerHeight * window.devicePixelRatio * .0004);
        
		this.game.physics.enable(shifter, Phaser.Physics.ARCADE, true);

	},
	

	
	shiftDirection : function(sprite, shifter){
		if (shifter.warningFlag == true && sprite.safe == false){
			sprite.startRed();
		}
		if ((sprite.direction == "left" || sprite.direction == "up-left" || sprite.direction == "down-left") && (shifter.direction == "right" || shifter.direction == "up-right" || shifter.direction == "down-right")){
			sprite.scale.x = sprite.scale.x * -1;
		}
		else if ((sprite.direction == "right" || sprite.direction == "up-right" || sprite.direction == "down-right") && (shifter.direction == "left" || shifter.direction == "up-left" || shifter.direction == "down-left")){
			sprite.scale.x = sprite.scale.x * -1;
		}
		else sprite.scale.x = sprite.scale.x;
		
		sprite.direction = shifter.direction;
	},
		
    //Function I was using to check what unsafe children were still alive to monitor killing the offscreen children
    announceLiving: function(){
        alert(this.unsafeChildren.countLiving());
    }
};