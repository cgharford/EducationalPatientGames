module.exports = {
  /**
  *Game1 class. The game1 object, primary state of the game, handles all actual gameplay.
  
  *@class game1
  
  */
   /**
     * phaser create function  -- initializes the game state, initialize game map, sounds, text messages, and clock. Starts spawners. Creates shifters for path manipulation.  
     * @method create
     *   
     */
    create: function() {
        this.multiplier = 1;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        firstRateIncrease = false;
        secondRateIncrease = false;
        //Add background
        background = this.add.sprite(1024, 768, 'lake');
        background.x = 0;
        background.y = 0;
        background.height = this.game.height;
        background.width = this.game.width;

        //
        unsafeChildren = this.game.add.group();
        safeChildren = this.game.add.group();
        directionShifters = this.game.add.group();


        this.createChild(this.game.width, (this.game.height / 8), "left", unsafeChildren, 'unsafe', this.onUnsafeClick);
        //We can create spawn points wherever we want so the sprites start on paths etc.
        this.startSpawn(6, this.game.width, (this.game.height / 8), "left");
        this.startSpawn(3, 0, (this.game.height / 4), "down-right")
        this.createShifter(11 * (this.game.width / 12), this.game.height / 8, "down", false, false);
        this.createShifter(11 * (this.game.width / 12), 23 * this.game.height / 24, "left", false, false);
        this.createShifter(this.game.width / 7, 5 * this.game.height / 10, "right", false, false);
        this.createShifter(5 * this.game.width / 9, 4 * this.game.height / 8, "up-right", false, false);
        this.createShifter(6.8 * this.game.width / 10, this.game.height / 4, "up-left", true, false);
        this.createShifter(2 * (this.game.width / 12), 23 * this.game.height / 24, "left", true, false);

        // Alternate Path
		
        // this.createShifter(6 * (this.game.width / 12), 23 * this.game.height / 24, "up-left", false, true);
        // this.createShifter(4 * this.game.width / 12, 4.7 * this.game.height / 9, "left", true, false);
        /*
         This will allow to check num of living unsafe children to see if offscreen are killed
         this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.announceLiving);
         */

        //Add funky negative sound and positive sound
        bad_sound = this.add.audio('bad_sound');
        good_sound = this.add.audio('good_sound');

        // Score starts at 0, timer starts at 60 seconds
        score = 0;
        timeRemaining = 60;
        maxTime = timeRemaining
        textStyle = {
            font: '35px Arial',
            fill: '#666699',
            align: 'right',
            wordWrap: false
        };

        // Add error message for clicking incorrectly
        errorText = this.game.add.text(this.game.width - 200, this.game.width / 50, 'Dude, what?', textStyle);
        errorText.visible = false;
        errorText.anchor.set(0.5);

        // Add success message for clicking correctly
        successText = this.game.add.text(this.game.width - 200, this.game.width / 50, 'You saved me!', textStyle);
        successText.visible = false;
        successText.anchor.set(0.5);

        //  Place score and timer in lower left hand corner
        scoreText = this.game.add.text(60, this.game.width / 50, 'Score: ' + score, {
            fill: '#666699'
        });
        clockText = this.game.add.text(120 + scoreText.width, this.game.width / 50, 'Time Remaining: ' + timeRemaining, {
            fill: '#666699'
        });
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

        // Allow game to be paused
        pause = this.game.add.text(240 + scoreText.width + clockText.width, this.game.width / 50, "Pause", {
            fill: '#666699'
        });
        pause.inputEnabled = true;
        pause.events.onInputDown.add(this.pauseGame, this);

        instructions = this.add.image((this.game.width / 2) - 1024 / 2, (this.game.height / 2) - 768 / 2, 'instructions');
        instructions.visible = false;

        // Click anywhere to unpause
        this.game.input.onDown.add(this.unpauseGame, this);

        // On time out, show score
        victoryText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Congratulations your score is ' + score + '!', textStyle);
        victoryText.visible = false;
        victoryText.anchor.set(0.5);
        this.pauseGame();
    },

    /**
     * Pauses the game, shows instruction screen
     * @method pauseGame
     *   
     */
    pauseGame: function() {
        this.game.paused = true;
        instructions.visible = true;

    },
    /**
     * Unpauses the game, removes the instruction screen
     * @method unpauseGame
     *   
     */
    unpauseGame: function() {
        this.game.paused = false;
        instructions.visible = false;

    },
    //phaser update function
    /**
     * Functionality called every time game updates. Moves sprites, checks collision, updates time
	 *Precondition: Game created and exists
     * @method update
     *   
     */
    update: function() {
        //check if time is 2/3 or 1/3 and create new spawns for faster spawn rate
        if (timeRemaining == (2 * (maxTime / 3)) && firstRateIncrease == false) {
            bad_sound.play();
            this.startSpawn(3, this.game.width, (this.game.height / 8), "left");
            this.startSpawn(3, 0, (this.game.height / 4), "down-right");

            firstRateIncrease = true;
        }

        if (timeRemaining == (maxTime / 3) && secondRateIncrease == false) {
            bad_sound.play();
            this.startSpawn(3, this.game.width, (this.game.height / 8), "left");
            this.startSpawn(3, 0, (this.game.height / 4), "down-right");
            secondRateIncrease = true;

        }
        //also increase movement speed at 2/3 and 1/3 time
        if (timeRemaining <= (maxTime / 3)) {
            for (var i = 0; i < unsafeChildren.children.length; i++) {
                unsafeChildren.children[i].velocity = 3;
            }
            for (var i = 0; i < safeChildren.children.length; i++) {
                safeChildren.children[i].velocity = 3;
            }
        } else if (timeRemaining <= (2 * (maxTime / 3))) {
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
        if (timeRemaining <= 0) {
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
                if(!currentChild.safe){
                    this.multiplier = 1;
                }
                currentChild.kill();
            }

        }
        // For each child alive, move and animate
        // For each child off screen, kill sprite
        for (var i = 0; i < safeChildren.children.length; i++) {
            var currentChild = safeChildren.children[i];
            if (currentChild.alive) {
                currentChild.move();
                currentChild.animations.play('ride');

            }
            // Ensure kill of screen sprites
            if (currentChild.position.x > this.game.width || currentChild.position.x < 0 || currentChild.position.y > this.game.height || currentChild.position.y < 0) {
                if(!currentChild.safe){
                    this.multiplier = 1;
                }
                currentChild.kill(); //weird stuff still happening with killing offscreen?
            }

        }
    },

    // Clicking a sprite being safe
    /**
     * Called when clicking an already safe sprite, gives warning message
	*Precondition: Sprite exists and is safe
	*Postcondition: Sprite exists and is still safe
     * @method onSafeClick Function to execute when safe sprite is clicked
     * @param {} sprite Sprite object that is being clicked
     *   
     */
    onSafeClick: function(sprite) {

        // No longer Decrement score - client requested no negative feedback for clicking a good child sprite
       // if (score > 0) {
           // score -= 1;
       // }

        // Show error msg for 500ms and set to visible
        this.multiplier = 1;
        errorTextTimer = this.game.time.now + 500;
        errorText.visible = true;
        successText.visible = false;

    },

    // Clicking a sprite being unsafe
	//creates a child to replace old child with to "put helmet on child"
    /**
     *  make an unsafe child sprite into a safe child sprite after being clicked
	 *Precondition: Sprite exists and is unsafe
	 *Postcondition: Sprite is replaced by safe sprite
     * @method onUnsafeClick Function to be executed when an unsafe sprite is clicked
     * @param {} sprite Sprite object that is being clicked
     *   
     */
    onUnsafeClick: function(sprite) {

        score += 10 * this.multiplier;
        if(this.multiplier !== 20){
            this.multiplier ++;
        }
        good_sound.play();
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
        successText.visible = true;
        sprite.kill();
    },

    /**
     * Called when player "wins" the game
	 *Postcondition: game is now in victory1 state
     * @method victory
     *   
     */
    victory: function() {
        safeChildren.forEach(function(child) {
            child.kill();
        });
        errorText.visible = false;
        successText.visible = false;
        victoryText.visible = true;
        //change to victory state
        this.game.state.start("Victory2", true, false, score);
    },
    /**
     * Function for placing random children -- NO LONGER USED BUT MAINTAINED FOR FUTURE
     * @method placeRandomChildren
     * @param {} group Group the children will belong to
     * @param {} spriteName Name of the sprite used for the children
     * @param {} listener Function to be executed when children are clicked
     *   
     */
    placeRandomChildren: function(group, spriteName, listener) {
        for (var i = 0; i < 3; i++) {
            child = group.create(0, 0, spriteName);
            child.inputEnabled = true;
            child.events.onInputDown.add(listener, this);
            child.anchor.set(0.5);
            child.position.x = this.game.world.randomX;
            child.position.y = this.game.world.randomY;
            child.animations.add('ride', [0, 1, 2, 3, 4], 4, true);
        }
        group.setAll('outOfBoundsKill', true);
    },

    //function for creating a sprite spawner
    /**
     * function for creating a sprite spawner
     * @method startSpawn
     * @param {} timeDelay time between each sprite in seconds
     * @param {} x x coordinate
     * @param {} y y coordinate
     * @param {} direction direction sprite will move in
     *   
     */
    startSpawn: function(timeDelay, x, y, direction) {
        var delayTime = Phaser.Timer.SECOND * timeDelay;
        this.game.time.events.loop(delayTime, this.createRandomChild, this, x, y, direction);

    },

    /**
     * Modifies the clock time of the game
	 *Postcondition: timeRemaining is one less
     * @method updateTime
     *   
     */
    updateTime: function() {
        timeRemaining -= 1;
    },

    //function to pick a random sprite from the 3 safe and 3 unsafe sprites
    /**
     * function to pick a random sprite from the 3 safe and 3 unsafe sprites. Gives x,y coordinate and direction to move in
	 *Precondition: startx, starty are valid positive integers, and direction is "up" "down" "left" "right" "up-left" "up-right" "down-left" "down-right"
     * @method createRandomChild
     * @param {} startx x coordinate
     * @param {} starty y coordinate
     * @param {} direction direction the child will move in
     *   
     */
    createRandomChild: function(startx, starty, direction) {
        var group;
        var spriteName;
        var listener;
        var randomNum = Math.random();
        //.65 chance to be unsafe
        if (randomNum > .35) {

            group = unsafeChildren;
            if (randomNum > .5 && randomNum < .7) {
                spriteName = 'unsafe';
            } else if (randomNum > .7) {
                spriteName = 'unsafeSkate';
            } else {
                spriteName = 'unsafeATV';
            }
            listener = this.onUnsafeClick;
        }

        //else safe
        else {
            group = safeChildren;
            if (randomNum > .2 && randomNum < .35) {
                spriteName = 'safe';
            } else if (randomNum > .1) {
                spriteName = 'safeSkate';
            } else {
                spriteName = 'safeATV';
            }
            listener = this.onSafeClick;
        }

        this.createChild(startx, starty, direction, group, spriteName, listener);

    },

    //function to create a child, called by create random child
    /**
     * function to create a child, called by create random child. Gives x y coordinates, direction to move in, group belongs to, name of image, and function to call when clicked
	 *Precondition: startx, starty are valid positive integers, and direction is "up" "down" "left" "right" "up-left" "up-right" "down-left" "down-right" group is a valid child group, spriteName is a valid sprite, and listener is a valid function call
	 *Postcondition: Group size is increased by one
     * @method createChild
     * @param {} startx x coordinate
     * @param {} starty y coordinate
     * @param {} direction direction the child will move in
     * @param {} group group the child will belong to
     * @param {} spriteName name of the sprite the child will use
     * @param {} listener function to be executed when sprite is clicked
     *   
     */
    createChild: function(startx, starty, direction, group, spriteName, listener) {
        var child;
        //initialize properties
        child = group.create(0, 0, spriteName);
        child.inputEnabled = true;
        child.events.onInputDown.add(listener, this);
        child.anchor.set(0.5);
        child.position.x = startx;
        child.position.y = starty;
        child.direction = direction;
        child.safe = false;
        //if creating a safe child
        if (spriteName == 'safeSkate' || spriteName == 'safe' || spriteName == 'safeATV') {
            child.safe = true;
        }
        //if moving right, must flip the sprite image so it looks correct
        if (child.direction == "right" || child.direction == "down-right" || child.direction == "up-right")
            child.scale.x = child.scale.x * -1;
        this.game.physics.enable(child, Phaser.Physics.ARCADE, true);
        child.checkWorldBounds = true;
        child.outOfBoundsKill = true;
        if (spriteName == 'safe' || spriteName == 'unsafe') {
            //name, frames, fps, boolean for loop (true means plays more than once)
            child.animations.add('ride', [0, 1, 2, 3, 4], 4, true);
        } else if (spriteName == 'safeSkate' || spriteName == 'unsafeSkate') {
            child.scale.x = child.scale.x * -1;
            child.animations.add('ride', [0, 1, 2, 3, 4, 5], 5, true);
        } else if (spriteName == 'safeATV' || spriteName == 'unsafeATV') {
            child.scale.x = child.scale.x * -1;
            child.animations.add('ride', [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
        }
        //initializing velocity to 1, adjusted as game time elapses
        child.velocity = 1;

        /**
         * Makes sprite red
         * @method flashRed
         *   
         */
        child.flashRed = function() {
            child.tint = 0xff0000;
        };

        /**
         * Returns a sprite to its original color after flashing red
         * @method restoreColor
         *   
         */
        child.restoreColor = function() {
            child.tint = 0xFFFFFF;
        };

        /**
         * Starts the sprite flashing red to warn player 
         * @method startRed
         *   
         */
        child.startRed = function() {
            child.flashRed();
        };
        /**
         * Tells a sprite object to move in its current direction
		*Precondition: child has a valid direction to move in and a valid velocity to move by
         * @method move
         *   
         */
        child.move = function() {

            if (this.direction === "up") {
                this.position.y -= this.velocity;
            } else if (this.direction === "down") {
                this.position.y += this.velocity;
            } else if (this.direction === "left") {
                this.position.x -= this.velocity;
            } else if (this.direction === "right") {
                this.position.x += this.velocity;
            } else if (this.direction == "up-right") {
                this.position.x += this.velocity;
                this.position.y -= this.velocity;
            } else if (this.direction == "up-left") {
                this.position.x -= this.velocity;
                this.position.y -= this.velocity;

            } else if (this.direction == "down-left") {
                this.position.x -= this.velocity;
                this.position.y += this.velocity;
            } else if (this.direction == "down-right") {
                this.position.x += this.velocity;
                this.position.y += this.velocity;

            }

        };
    },
    //creates a shifter sprite, which will change the direction of any player sprite it collides with
    /**
     * creates a shifter sprite at (x, y), which will change the direction of any player sprite it collides with. Warning flag if turns sprite red
	 *Precondition: x,y are valid positive integers, and newDirection is "up" "down" "left" "right" "up-left" "up-right" "down-left" "down-right". 
     * @method createShifter
     * @param {} x x coordinate
     * @param {} y y coordinate
     * @param {} newDirection Direction the shifter will force sprites to move. May be "up" "down" "left" "right" "up-left" "up-right" "down-left" "down-right"
     * @param {} warning boolean value whether a sprite will turn red when passing through the shifter
     * @param {} randomShift boolean value whether shifter will randomly choose direction
     *   
     */
    createShifter: function(x, y, newDirection, warning, randomShift) {
        console.log('Create Shifter Fired!')
        //redsquare used as a placeholder for an invisible sprite image
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
        shifter.randomShift = randomShift;

        this.game.physics.enable(shifter, Phaser.Physics.ARCADE, true);

    },

    //shifts the direction of a sprite based on the direction of the shifter 
    /**
     * shifts the direction of a sprite based on the direction of the shifter 
	 *Precondition: sprite and shifter both have valid directions
     * @method shiftDirection
     * @param {} sprite
     * @param {} shifter
     *   
     */
    shiftDirection: function(sprite, shifter) {
        if (shifter.warningFlag == true && sprite.safe == false) {
            sprite.startRed();
        }
        if ((sprite.direction == "left" || sprite.direction == "up-left" || sprite.direction == "down-left") && (shifter.direction == "right" || shifter.direction == "up-right" || shifter.direction == "down-right")) {
            sprite.scale.x = sprite.scale.x * -1;
        } else if ((sprite.direction == "right" || sprite.direction == "up-right" || sprite.direction == "down-right") && (shifter.direction == "left" || shifter.direction == "up-left" || shifter.direction == "down-left")) {
            sprite.scale.x = sprite.scale.x * -1;
        } else sprite.scale.x = sprite.scale.x;

        sprite.direction = shifter.direction;

        var randNum = Math.round(Math.random() * (100));

        if (!(shifter.randomShift == true) && randNum < 50) {
            sprite.direction = shifter.direction;
        } else {
            sprite.direction = sprite.direction;
        }
    },

    //Function I was using to check what unsafe children were still alive to monitor killing the offscreen children
    /**
     * Function I was using to check what unsafe children were still alive to monitor killing the offscreen children
     * @method announceLiving
     *   
     */
    announceLiving: function() {
        alert(this.unsafeChildren.countLiving());
    }

};