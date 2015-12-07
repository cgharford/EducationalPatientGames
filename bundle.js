(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
	/**
  *boot class. The boot object, boot state of the game
  
  *@class boot
  */
            /**
             * initialize 
             * @method init
             * 
             */
            init: function () {
                //Set high score cookies
                Cookies.set('high_scores_game2', [0, 0, 0]);
                Cookies.set('high_scores_game1', [0,0,0]);
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.setMinMax(480, 260, 1024, 768);
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;
                //oritentation forcing.
                if (!(this.game.device.desktop)){
                    this.scale.forceOrientation(true, false);
                    this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
                    this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
                }

            },

            /**
             * Phaser create function, starts next state "Wrapper"
             * @method create
             * 
             */
            create: function () {

                this.game.state.start("Wrapper");
            },

            /**
             * fixes orientation of game
             * @method enterIncorrectOrientation
             * @return 
             */
            enterIncorrectOrientation: function () {
                document.getElementById('game-container').style.display = 'none';
                document.getElementById('orientation').style.display = 'block';

            },

            /**
             * preserves orientation of game
             * @method leaveIncorrectOrientation
             *  
             */
            leaveIncorrectOrientation: function () {
                document.getElementById('game-container').style.display = 'block';
                document.getElementById('orientation').style.display = 'none';
                window.location.reload();

            }

    };
},{}],2:[function(require,module,exports){
/**
Game module which consists of all game states and client side functionality
@module game
*/
var w = window.innerWidth * window.devicePixelRatio, h = window.innerHeight * window.devicePixelRatio;

//create a phaser game that will be everything we use
var game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h,Phaser.CANVAS, "game-container");

game.globals = {
    //Add variables here that you want to access globally
    //score: 0 could be accessed as game.globals.score for example
};


//load all states that exist in the game.
game.state.add('Preload1',require('./game1/preload1.js'));
game.state.add("Title1",require('./game1/title1.js'));
game.state.add("Game1",require('./game1/game1.js'));
game.state.add("Victory1",require('./game1/victory1.js'));
game.state.add('Preload2',require('./game2/preload2.js'));
game.state.add("Title2",require('./game2/title2.js'));
game.state.add("Game2",require('./game2/game2.js'));
game.state.add("Victory2",require('./game2/victory2.js'));
game.state.add('Boot', require('./boot.js'));
game.state.add('Wrapper', require('./wrapper.js'));
//start game in boot state.
game.state.start('Boot');
},{"./boot.js":1,"./game1/game1.js":3,"./game1/preload1.js":4,"./game1/title1.js":5,"./game1/victory1.js":6,"./game2/game2.js":7,"./game2/preload2.js":8,"./game2/title2.js":9,"./game2/victory2.js":10,"./wrapper.js":11}],3:[function(require,module,exports){
module.exports = {
    /**
    *Game2 class. The game1 object, primary state of the game, handles all actual gameplay.
  
    *@class game2
  
    */
    /**
     * phaser create function  -- initializes the game state, initialize game map, sounds, text messages, and clock. Starts spawners. Creates shifters for path manipulation.  
     * @method create
     *   
     */
    create: function() {
        this.urgency = 1;
        this.multiplier = 1;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.lives = 3;
        //Add background
        park = this.add.sprite(this.game.height, this.game.width, 'bg');
        park.x = 0;
        park.y = 0;
        park.height = this.game.height;
        park.width = this.game.width;


        this.life_sprite_2 = this.add.sprite(this.game.width - 230, this.game.height - 110, 'life');
        this.life_sprite_2.scale.setTo(0.15, 0.15);
        this.life_sprite_1 = this.add.sprite(this.game.width - 345,  this.game.height - 110, 'life');
        this.life_sprite_1.scale.setTo(0.15, 0.15);
        this.life_sprite_3 = this.add.sprite(this.game.width - 115, this.game.height - 110, 'life');
        this.life_sprite_3.scale.setTo(0.15, 0.15);

        //two groups - safe children and unsafe children.
        unsafeChildren = this.game.add.group();
        safeChildren = this.game.add.group();
        this.createChild(unsafeChildren, 'bike_unsafe', this.onUnsafeClick, this.generatePath(), 0);
        //spawner that spawns a person every 3 seconds
        this.startSpawn(3, this.game.width, (this.game.height / 8), "left");

        //Add funky negative sound and positive sound
        good_sound = this.add.audio('good_sound');
        bad_sound = this.add.audio('bad_sound');
        game_over = this.add.audio('game_over');

        // Score starts at 0, timer starts at 60 seconds
        score = 0;
        timeRemaining = 60;
        maxTime = timeRemaining
        //universal text styling
        textStyle = {
            font: '35px Arial',
            fill: '#FFFFFF',
            align: 'right',
            wordWrap: false
        };

        //  Place score and timer in upper left hand corner
        scoreText = this.game.add.text(500, this.game.width / 50, 'Score: ' + score, {
            fill: '#FFFFFF'
        });
        clockText = this.game.add.text(700 + scoreText.width, this.game.width / 50, 'Time Remaining: ' + timeRemaining, {
            fill: '#FFFFFF'
        });
        //update the time score every second
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

        //every 5 seconds, speed up the children
        this.game.time.events.loop(Phaser.Timer.SECOND * 5, function() {
            var speed = this.urgency + 1;
            for (var i = 0; i < unsafeChildren.children.length; i++) {
                unsafeChildren.children[i].urgency = speed;
            }
            for (var i = 0; i < safeChildren.children.length; i++) {
                safeChildren.children[i].urgency =speed;
            }
            this.urgency += 1;
        }, this);

        // Allow game to be paused
        pause = this.game.add.text(880 + scoreText.width + clockText.width, this.game.width / 50, "Pause", {
            fill: '#FFFFFF'
        });
        pause.inputEnabled = true;
        pause.events.onInputDown.add(this.pauseGame, this);

        //add instructions info picture
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
        // Update score, timer, and victory texts with new values
        scoreText.text = 'Score: ' + score;
        clockText.text = 'Time Remaining: ' + timeRemaining;
        victoryText.text = 'Congratulations your score is ' + score + '!';

        // If timer runs out, show victory or if we have no lives
        if (timeRemaining <= 0 || this.lives <= 0) {
            this.victory();
        }

        // For each child alive, move and animate
        // For each child off screen, kill sprite
        for (var i = 0; i < unsafeChildren.children.length; i++) {
            var currentChild = unsafeChildren.children[i];
            if (currentChild.alive) {
                currentChild.move();
                currentChild.animations.play('row');

            }

            if (currentChild.position.x > this.game.width) {
                this.multiplier = 1;
                this.lives -= 1;
                if(this.lives == 2){
                    this.life_sprite_1.kill();
                }
                else if (this.lives == 1){
                    this.life_sprite_2.kill();
                }
                else if (this.lives == 0){
                    this.life_sprite_3.kill();
                }
                bad_sound.play();
                unsafeChildren.remove(currentChild);
                currentChild.kill();
            }

        }
        // For each child alive, move and animate
        // For each child off screen, kill sprite
        for (var i = 0; i < safeChildren.children.length; i++) {
            var currentChild = safeChildren.children[i];
            if (currentChild.alive) {
                currentChild.move();
                currentChild.animations.play('row');

            }
            // Ensure kill of screen sprites
            if (currentChild.position.x > this.game.width) {
                score += 10 * this.multiplier;
                if (this.multiplier < 20)
                {
                    this.multiplier += 1;
                }
                currentChild.kill(); 
                safeChildren.remove(currentChild);
            }

        }
    },

    generatePath: function() {
        var game = this.game

        /*
            generate a random x coordinate
            within 6 sections of the visible screen
            and two off-screen sections 
        */
        generateXPoint = function(sect) {
            switch (sect) {
                case 0:
                    return game.rnd.between(-10, 0);
                case 1:
                    return game.rnd.between(0, game.width / 7);
                case 2:
                    return game.rnd.between(game.width / 7, (game.width * 2) / 7);
                case 3:
                    return game.rnd.between((game.width * 2) / 7, (game.width * 3) / 7);
                case 4:
                    return game.rnd.between((game.width * 3) / 7, (game.width * 4) / 7);
                case 5:
                    return game.rnd.between((game.width * 4) / 7, (game.width * 5) / 7);
                case 6:
                    return game.rnd.between((game.width * 5) / 7, (game.width * 6) / 7);
                case 7:
                    return game.rnd.between((game.width * 6) / 7, (game.width * 7) / 7);
                case 8:
                    return game.rnd.between((game.width * 7) / 7, (game.width * 8) / 7);
                default:
                    console.log('error in gen x point');
            }
        };
        /*
            generate a random y coordinate
            within the visible bounds of the screen
        */
        generateYPoint = function(sect) {
            return game.rnd.between((game.height / 2.5), (game.height * 9) / 10);
        };


        var yPoints = [];
        var xPoints = [];
        //create a list of x, y pairs
        for (var i = 0; i <= 8; i++) {
            yPoints.push(generateYPoint(i));
            xPoints.push(generateXPoint(i));
        }
        //define those lists in object with 
        //properties y and x
        var pathPts = {
            'y': yPoints,
            'x': xPoints
        };
        //interpolate the paths of the object itself to get a path
        //this is all done in accordance to phaser tutorials.
        interpolatePaths = function(pathPts, game) {
            x = 1 / game.width;
            var truePath = [];
            for (var i = 0; i <= 1; i += x) {
                var px = game.math.bezierInterpolation(pathPts.x, i);
                var py = game.math.bezierInterpolation(pathPts.y, i);
                truePath.push({
                    'x': px,
                    'y': py
                });
            }
            return truePath;
        }

        return interpolatePaths(pathPts, game);
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
        if (this.multiplier < 20) {
            this.multiplier++;
        }
        good_sound.play();
        var safeChild;
        var newImage;
        if (sprite.key == 'bike_unsafe')
            newImage = 'bike_safe';
        else if (sprite.key == 'bike_unsafe_alt')
            newImage = 'bike_safe_alt';
        safeChild = this.createChild(safeChildren, newImage, this.onSafeClick, sprite.path, sprite.pi);
        sprite.kill();
    },

    /**
     * Called when player wins the game or loses
     *Postcondition: game is now in victory2 state
     * @method victory
     *   
     */
    victory: function() {
        safeChildren.forEach(function(child) {
            child.kill();
        });
     //    victoryText.visible = true;
        game_over.play();
        //change to victory state
        this.game.state.start("Victory1", true, false, score);
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
            child.animations.add('row', [0, 1, 2, 3, 4], 4, true);
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

    //function to pick a random sprite from the 2 safe and 2 unsafe sprites
    /**
     * function to pick a random sprite from the 2 safe and 2 unsafe sprites. Gives x,y coordinate and direction to move in
     *Precondition: startx, starty are valid positive integers, and direction is unnecessary - should be removed and cleaned up.
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
                spriteName = 'bike_unsafe';
            } else {
               spriteName = 'bike_unsafe_alt';
            }
            listener = this.onUnsafeClick;
        }

        //else safe
        else {
            group = safeChildren;
            if (randomNum > .2 && randomNum < .35) {
                spriteName = 'bike_safe';
            } else {
                spriteName = 'bike_safe_alt';
            }
            listener = this.onSafeClick;
        }
        this.createChild(group, spriteName, listener, this.generatePath(), 0);

    },

    //function to create a child, called by create random child
    /**
     * function to create a child, called by create random child. Gives x y coordinates, 
      direction to move in, group belongs to, name of image, and function to call when clicked
     *Postcondition: Group size is increased by one
     * @method createChild
     * @param {} direction direction the child will move in
     * @param {} group group the child will belong to
     * @param {} spriteName name of the sprite the child will1  use
     * @param {} listener function to be executed when sprite is clicked
     * @param {} path the path to be used for motion
     * @param {} pi the value that we keep incrementing to move down our path
     */
    createChild: function(group, spriteName, listener, path, pi) {
        var child;
        //initialize properties
        child = group.create(0, 0, spriteName);
        child.inputEnabled = true;
        child.events.onInputDown.add(listener, this);
        child.pi = pi;
        child.urgency = this.urgency;
        child.anchor.set(0.5);
        child.path = path;
        //set the position to somewhere on our path
        child.position.x = child.path[child.pi].x;
        child.position.y = child.path[child.pi].y;


        child.safe = false;
        //if creating a safe child
        if (spriteName == 'bike_safe' || spriteName == 'bike_safe_alt') {
            child.safe = true;
        }
        //enable physics on this object
        this.game.physics.enable(child, Phaser.Physics.ARCADE, true);
        child.checkWorldBounds = true;
        child.outOfBoundsKill = true;
        
        //animation and scale setup
        //name, frames, fps, boolean for loop (true means plays more than once)
        child.animations.add('row', [0, 1, 2, 3, 4], 4, true);
        scaleX = (this.game.width / 15) / 115;
        scaleY = (this.game.width / 15) / 120;
        child.scale.x = scaleX;
        child.scale.y = scaleY;


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
            if (this.path[this.pi] == null) {
                this.kill();
                return;
            } else {
                this.position.x = this.path[this.pi].x;
                this.position.y = this.path[this.pi].y;
                this.pi += 1 * this.urgency;
            }
        };

    }

};

},{}],4:[function(require,module,exports){
module.exports = {
	  /**
  *preload1 class. The preload object, first state of the game, preloads all necessary assets
  
  *@class preload1
  
  */
  
     /**
     * phaser preload function  -- loads in all necessary assets (images, sprites, spritesheets, audio) for use in the other game states
     * @method preload
     *   
     */
    preload: function() {
        this.game.load.image('play button', './assets/game1/images/UIP-play-button.png');
        this.game.load.image('title page bg',  './assets/general/images/UIP-title_poss.jpeg');
        this.game.load.image('bg', './assets/game1/images/park_background.png');
        this.game.load.image('instructions', './assets/game1/images/instructions.png');
        this.game.load.audio('bad_sound', './assets/general/audio/lost_life.wav', true);
        this.game.load.audio('good_sound', './assets/general/audio/good_sound.wav', true);
        this.game.load.audio('game_over', './assets/general/audio/game_over.wav', true);;
        this.game.load.spritesheet('bike_safe', './assets/game1/images/spritesheets/bike_safe.png', 108, 115);
        this.game.load.spritesheet('bike_unsafe', './assets/game1/images/spritesheets/bike_unsafe.png', 108, 115);
        this.game.load.spritesheet('bike_safe_alt', './assets/game1/images/spritesheets/bike_safe_alt.png', 108, 115);
        this.game.load.spritesheet('bike_unsafe_alt', './assets/game1/images/spritesheets/bike_unsafe_alt.png', 108, 115);
        this.game.load.image('replay button', './assets/game1/images/UIP-replay-button.png');
        this.game.load.image('victory page bg', './assets/game1/images/UIP-victory.png');
        this.game.load.image('life', './assets/game1/images/bike_life.png');

    },
	
	   /**
     * phaser create function  -- loads next state, the title screen
     * @method create
     *   
     */
    create: function() {
        this.game.state.start("Title1");
    }
};
},{}],5:[function(require,module,exports){
module.exports = {
	  /**
  *title1 class. The title1 object, just displays title screen
  
  *@class title1
  */
  
     /**
     * phaser create function  -- initializes the title state, displays title screen and play button.
     * @method create
     * @return 
     */
    create: function() {
        var titleBg = this.add.sprite(this.game.width, this.game.height, 'title page bg');
        titleBg.x = 0;
        titleBg.y = 0;
        titleBg.height = this.game.height;
        titleBg.width = this.game.width;

        var playButton = this.game.add.sprite(319, 160, 'play button');
        playButton.x = this.game.width - 319;
        playButton.y = this.game.height - 160;
        playButton.inputEnabled = true;

        playButton.events.onInputDown.add(this.playGame,this);

       
    },
	
	   /**
     * playGame function that begins the gameplay state Game1
     * @method playGame
     * @return 
     */
    playGame: function() {
        this.game.state.start("Game1");
    }
};

},{}],6:[function(require,module,exports){
module.exports = {
    /**
  *Victory1 class. The victory1 object, final state of the game
  
  *@class victory1
  
  */

    /**
     * phaser create function  -- initializes the victory state, initialize victory image, text messages, and scores. Starts spawners. Creates 
     * @method create
     * @return 
     */
    create: function() {
        //get the cookie for high scores.
    /* Deprecated - Get high score data from cookies - Deprecated */  
        //highScores = Cookies.getJSON('high_scores_game2');
        responseArray = [];
    /* Send a POST request to the high score database
     * Returns a pipe-delimeted string of the top 5 scores (in order)
     * (ex: 2000|1000|750|565|20)
     */
        $.ajax({
            type: 'POST',
            url: "./db-api/savescores.php",
            data: "game=helmet&score=" + score,
            dataType: "text",
            success: function(data, status) {
                response = data;
                console.log("Data: " + data + "\nStatus: " + status);
            },
            async: false
        });
    // Split the XHR response if it was successfully received
        try {
            responseArray = (response).split("|");
        } catch (e) { // Otherwise, follow built-in error handling procedure
            responseArray = [score, -1, -1, -1];
        }

        if(responseArray[0] == undefined || responseArray == "NULL") {
            responseArray[0] = score;
        }
        if(responseArray[1] == undefined || responseArray == "NULL") {
            responseArray[1] = -1;
        }
        if(responseArray[2] == undefined || responseArray == "NULL") {
            responseArray[2] = -1;
        }
        if(responseArray[3] == undefined || responseArray == "NULL") {
            responseArray[3] = -1;
        }


        var victoryBg = this.add.sprite(this.game.width, this.game.height, 'victory page bg');
        victoryBg.x = 0;
        victoryBg.y = 0;
        victoryBg.height = this.game.height;
        victoryBg.width = this.game.width;

        //replay button
        var replayButton = this.game.add.sprite(513, 63, 'replay button');
        replayButton.x = (944 * this.game.width / 1024) - 513;
        replayButton.y = (590 * this.game.height / 768) - 63;
        replayButton.inputEnabled = true;

        textStyle = {
            font: "48px Arial",
            fill: "#ffffff",
            align: "center"
        };

    // Deprecated 
        // var yourScore = this.game.add.text(431, 172, score + " points", textStyle);
        // yourScore.x = 12 * this.game.width / 20;
        // yourScore.y = 6.5 * this.game.height / 20;
        // yourScore.visible = true;
    // End Deprecated Code

    //Display the 4 highest scores that were pulled from the database.
        // If the scores didn't make it to the client for some reason, just display the user's current score.
        scores0 = this.game.add.text(11 * this.game.width / 20, 6.5 * this.game.height / 20, (responseArray[0] + " points").trim(), textStyle);
        scores0.visible = true;
        // Load up the high scores, but don't display them yet. 
        scores1 = this.game.add.text(11 * this.game.width / 20, 8 * this.game.height / 20, responseArray[1] + " points", textStyle);
        scores2 = this.game.add.text(11 * this.game.width / 20, 9.5 * this.game.height / 20, responseArray[2] + " points", textStyle);
        scores3 = this.game.add.text(11 * this.game.width / 20, 11 * this.game.height / 20, responseArray[3] + " points", textStyle);
        scores1.visible = false;
        scores2.visible = false;
        scores3.visible = false;

        //Display the high scores iff they made it back successfully and weren't equal to NULL
        if(responseArray[1] > 0) {
            scores1.visible = true;
        }
        if(responseArray[2] > 0) {
            scores2.visible = true;
        }
        if(responseArray[3] > 0) {
            scores3.visible = true;
        }

        // Show the user his/her score at the bottom of the results page
        this.game.add.text(this.game.width / 2 - 275, 6 * this.game.height / 7, "Your Score:       " + score + " points!", {font: "bold 60px Arial", fill:"#ffffff"})

        //add an input function to the replay menut to send back to the wrapper
        replayButton.events.onInputDown.add(this.restart, this);

    /* Deprecated - high scores using cookies - Deprecated */
        //push out the lowest score.
        // highScores.push(score);
        // highScores.sort();
        // highScores.splice(0, 1);
        // //store the three highest scores
        // Cookies.set('high_scores_game2', highScores);
    },

    restart: function() {
        this.game.state.start('Wrapper');
    }
};

},{}],7:[function(require,module,exports){
module.exports = {
    /**
    *Game2 class. The game1 object, primary state of the game, handles all actual gameplay.
  
    *@class game2
  
    */
    /**
     * phaser create function  -- initializes the game state, initialize game map, sounds, text messages, and clock. Starts spawners. Creates shifters for path manipulation.  
     * @method create
     *   
     */
    create: function() {
        this.urgency = 1;
        this.multiplier = 1;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.lives = 3;
        //Add background
        park = this.add.sprite(this.game.height, this.game.width, 'lake');
        park.x = 0;
        park.y = 0;
        park.height = this.game.height;
        park.width = this.game.width;


        this.life_sprite_2 = this.add.sprite(this.game.width - 230, this.game.height - 90, 'life');
        this.life_sprite_2.scale.setTo(0.15, 0.15);
        this.life_sprite_1 = this.add.sprite(this.game.width - 345,  this.game.height - 90, 'life');
        this.life_sprite_1.scale.setTo(0.15, 0.15);
        this.life_sprite_3 = this.add.sprite(this.game.width - 115, this.game.height - 90, 'life');
        this.life_sprite_3.scale.setTo(0.15, 0.15);

        //two groups - safe children and unsafe children.
        unsafeChildren = this.game.add.group();
        safeChildren = this.game.add.group();
        this.createChild(unsafeChildren, 'boy_boater_unsafe', this.onUnsafeClick, this.generatePath(), 0);
        //spawner that spawns a person every 3 seconds
        this.startSpawn(3, this.game.width, (this.game.height / 8), "left");

        //Add funky negative sound and positive sound
        good_sound = this.add.audio('good_sound');
        bad_sound = this.add.audio('bad_sound');
        game_over = this.add.audio('game_over');

        // Score starts at 0, timer starts at 60 seconds
        score = 0;
        timeRemaining = 60;
        maxTime = timeRemaining
        //universal text styling
        textStyle = {
            font: 'bold 50px Arial',
            fill: '#FFFFFF',
            align: 'right',
            wordWrap: false
        };

        //  Place score and timer in upper left hand corner
        scoreText = this.game.add.text(500, this.game.width / 50, 'Score: ' + score, {
            fill: '#FFFFFF'
        });
        clockText = this.game.add.text(700 + scoreText.width, this.game.width / 50, 'Time Remaining: ' + timeRemaining, {
            fill: '#FFFFFF'
        });
        //update the time score every second
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

        //every 5 seconds, speed up the children
        this.game.time.events.loop(Phaser.Timer.SECOND * 5, function() {
            var speed = this.urgency + 1;
            for (var i = 0; i < unsafeChildren.children.length; i++) {
                unsafeChildren.children[i].urgency = speed;
            }
            for (var i = 0; i < safeChildren.children.length; i++) {
                safeChildren.children[i].urgency =speed;
            }
            this.urgency += 1;
        }, this);

        // Allow game to be paused
        pause = this.game.add.text(880 + scoreText.width + clockText.width, this.game.width / 50, "Pause", {
            fill: '#FFFFFF'
        });
        pause.inputEnabled = true;
        pause.events.onInputDown.add(this.pauseGame, this);

        //add instructions info picture
        instructions = this.add.image((this.game.width / 2) - 1024 / 2, (this.game.height / 2) - 768 / 2, 'instructions');
        instructions.visible = false;

        // Click anywhere to unpause
        this.game.input.onDown.add(this.unpauseGame, this);

        // On time out, show score
        victoryText = this.game.add.text(this.game.width / 2, (this.game.height / 2) + 25, 'Congratulations!  Your score is ' + score + '.', textStyle);
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
        // Update score, timer, and victory texts with new values
        scoreText.text = 'Score: ' + score;
        clockText.text = 'Time Remaining: ' + timeRemaining;
        victoryText.text = 'Congratulations!  Your score is ' + score + '.';

        // If timer runs out, show victory or if we have no lives
        if (timeRemaining <= 0 || this.lives <= 0) {
            this.victory();
        }

        // For each child alive, move and animate
        // For each child off screen, kill sprite
        for (var i = 0; i < unsafeChildren.children.length; i++) {
            var currentChild = unsafeChildren.children[i];
            if (currentChild.alive) {
                currentChild.move();
                currentChild.animations.play('row');

            }

            if (currentChild.position.x > this.game.width) {
                this.multiplier = 1;
                this.lives -= 1;
                if(this.lives == 2){
                    this.life_sprite_1.kill();
                }
                else if (this.lives == 1){
                    this.life_sprite_2.kill();
                }
                else if (this.lives == 0){
                    this.life_sprite_3.kill();
                }
                bad_sound.play();
                unsafeChildren.remove(currentChild);
                currentChild.kill();
            }

        }
        // For each child alive, move and animate
        // For each child off screen, kill sprite
        for (var i = 0; i < safeChildren.children.length; i++) {
            var currentChild = safeChildren.children[i];
            if (currentChild.alive) {
                currentChild.move();
                currentChild.animations.play('row');

            }
            // Ensure kill of screen sprites
            if (currentChild.position.x > this.game.width) {
                score += 10 * this.multiplier;
                if (this.multiplier < 20)
                {
                    this.multiplier += 1;
                }
                currentChild.kill(); 
                safeChildren.remove(currentChild);
            }

        }
    },

    generatePath: function() {
        var game = this.game

        /*
            generate a random x coordinate
            within 6 sections of the visible screen
            and two off-screen sections 
        */
        generateXPoint = function(sect) {
            switch (sect) {
                case 0:
                    return game.rnd.between(-10, 0);
                case 1:
                    return game.rnd.between(0, game.width / 7);
                case 2:
                    return game.rnd.between(game.width / 7, (game.width * 2) / 7);
                case 3:
                    return game.rnd.between((game.width * 2) / 7, (game.width * 3) / 7);
                case 4:
                    return game.rnd.between((game.width * 3) / 7, (game.width * 4) / 7);
                case 5:
                    return game.rnd.between((game.width * 4) / 7, (game.width * 5) / 7);
                case 6:
                    return game.rnd.between((game.width * 5) / 7, (game.width * 6) / 7);
                case 7:
                    return game.rnd.between((game.width * 6) / 7, (game.width * 7) / 7);
                case 8:
                    return game.rnd.between((game.width * 7) / 7, (game.width * 8) / 7);
                default:
                    console.log('error in gen x point');
            }
        };
        /*
            generate a random y coordinate
            within the visible bounds of the screen
        */
        generateYPoint = function(sect) {
            return game.rnd.between((game.height / 2.5), (game.height * 9) / 10);
        };


        var yPoints = [];
        var xPoints = [];
        //create a list of x, y pairs
        for (var i = 0; i <= 8; i++) {
            yPoints.push(generateYPoint(i));
            xPoints.push(generateXPoint(i));
        }
        //define those lists in object with 
        //properties y and x
        var pathPts = {
            'y': yPoints,
            'x': xPoints
        };
        //interpolate the paths of the object itself to get a path
        //this is all done in accordance to phaser tutorials.
        interpolatePaths = function(pathPts, game) {
            x = 1 / game.width;
            var truePath = [];
            for (var i = 0; i <= 1; i += x) {
                var px = game.math.bezierInterpolation(pathPts.x, i);
                var py = game.math.bezierInterpolation(pathPts.y, i);
                truePath.push({
                    'x': px,
                    'y': py
                });
            }
            return truePath;
        }

        return interpolatePaths(pathPts, game);
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
        if (this.multiplier < 20) {
            this.multiplier++;
        }
        good_sound.play();
        var safeChild;
        var newImage;
        if (sprite.key == 'boy_boater_unsafe')
            newImage = 'boy_boater_safe'
        else if (sprite.key == 'girl_boater_unsafe')
            newImage = 'girl_boater_safe';
        safeChild = this.createChild(safeChildren, newImage, this.onSafeClick, sprite.path, sprite.pi);
        sprite.kill();
    },

    /**
     * Called when player wins the game or loses
     * Precondition: timeRemaining <= 0
     * Postcondition: game is now in victory2 state
     * @method victory
     *   
     */
    victory: function() {
    // Kill off each remaining child    
        safeChildren.forEach(function(child) {
            child.kill();
        });
    // Enforce that the Time Remaining: display says 0
        timeRemaining = 0;

    // Removed the following due to the fact that it was unnecessary
    //    victoryText.visible = true;

        game_over.play();

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
            child.animations.add('row', [0, 1, 2, 3, 4], 4, true);
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

    //function to pick a random sprite from the 2 safe and 2 unsafe sprites
    /**
     * function to pick a random sprite from the 2 safe and 2 unsafe sprites. Gives x,y coordinate and direction to move in
     *Precondition: startx, starty are valid positive integers, and direction is unnecessary - should be removed and cleaned up.
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
                spriteName = 'boy_boater_unsafe';
            } else {
                spriteName = 'girl_boater_unsafe';
            }
            listener = this.onUnsafeClick;
        }

        //else safe
        else {
            group = safeChildren;
            if (randomNum > .2 && randomNum < .35) {
                spriteName = 'boy_boater_safe';
            } else {
                spriteName = 'girl_boater_safe';
            }
            listener = this.onSafeClick;
        }
        this.createChild(group, spriteName, listener, this.generatePath(), 0);

    },

    //function to create a child, called by create random child
    /**
     * function to create a child, called by create random child. Gives x y coordinates, 
      direction to move in, group belongs to, name of image, and function to call when clicked
     *Postcondition: Group size is increased by one
     * @method createChild
     * @param {} direction direction the child will move in
     * @param {} group group the child will belong to
     * @param {} spriteName name of the sprite the child will1  use
     * @param {} listener function to be executed when sprite is clicked
     * @param {} path the path to be used for motion
     * @param {} pi the value that we keep incrementing to move down our path
     */
    createChild: function(group, spriteName, listener, path, pi) {
        var child;
        //initialize properties
        child = group.create(0, 0, spriteName);
        child.inputEnabled = true;
        child.events.onInputDown.add(listener, this);
        child.pi = pi;
        child.urgency = this.urgency;
        child.anchor.set(0.5);
        child.path = path;
        //set the position to somewhere on our path
        child.position.x = child.path[child.pi].x;
        child.position.y = child.path[child.pi].y;


        child.safe = false;
        //if creating a safe child
        if (spriteName == 'boy_boater_safe' || spriteName == 'girl_boater_safe') {
            child.safe = true;
        }
        //enable physics on this object
        this.game.physics.enable(child, Phaser.Physics.ARCADE, true);
        child.checkWorldBounds = true;
        child.outOfBoundsKill = true;
        
        //animation and scale setup
        //name, frames, fps, boolean for loop (true means plays more than once)
        child.animations.add('row', [0, 1, 2, 3, 4], 4, true);
        scaleX = (this.game.width / 15) / 115;
        scaleY = (this.game.width / 15) / 120;
        child.scale.x = scaleX;
        child.scale.y = scaleY;


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
            if (this.path[this.pi] == null) {
                this.kill();
                return;
            } else {
                this.position.x = this.path[this.pi].x;
                this.position.y = this.path[this.pi].y;
                this.pi += 1 * this.urgency;
            }
        };

    }

};

},{}],8:[function(require,module,exports){
module.exports = {
	  /**
  *preload2 class. The preload object, first state of the game, preloads all necessary assets
  
  *@class preload2
  
  */
  
     /**
     * phaser preload function  -- loads in all necessary assets (images, sprites, spritesheets, audio) for use in the other game states
     * @method preload
     *   
     */
    preload: function() {
        this.game.load.image('play button', './assets/game1/images/UIP-play-button.png');
        this.game.load.image('title page bg', './assets/general/images/UIP-title_poss.jpeg');
        this.game.load.image('lake', './assets/game2/images/background.png');
        this.game.load.image('instructions', './assets/game2/images/happys_class2.png');
        this.game.load.audio('bad_sound', './assets/general/audio/lost_life.wav', true);
        this.game.load.audio('good_sound', './assets/general/audio/good_sound.wav', true);
        this.game.load.audio('game_over', './assets/general/audio/game_over.wav', true);
        this.game.load.spritesheet('girl_boater_safe', './assets/game2/images/spritesheets/safe_boat_girl.png', 108, 115);
        this.game.load.spritesheet('girl_boater_unsafe', './assets/game2/images/spritesheets/unsafe_boat_girl.png', 108, 115);
        this.game.load.spritesheet('boy_boater_safe', './assets/game2/images/spritesheets/safe_boat_boy.png', 108, 115);
        this.game.load.spritesheet('boy_boater_unsafe', './assets/game2/images/spritesheets/unsafe_boat_boy.png', 108, 115);
        this.game.load.image('replay button', './assets/game1/images/UIP-replay-button.png');
        this.game.load.image('victory page bg', './assets/game2/images/UIP-victory2.jpg');
        this.game.load.image('life', './assets/game2/images/life_ring.png');

    },
	
	   /**
     * phaser create function  -- loads next state, the title screen
     * @method create
     *   
     */
    create: function() {
        this.game.state.start("Title2");
    }
};
},{}],9:[function(require,module,exports){
module.exports = {
	  /**
  *title2 class. The title1 object, just displays title screen
  
  *@class title2
  */
  
     /**
     * phaser create function  -- initializes the title state, displays title screen and play button.
     * @method create
     * @return 
     */
    create: function() {
        var titleBg = this.add.sprite(this.game.width, this.game.height, 'title page bg');
        titleBg.x = 0;
        titleBg.y = 0;
        titleBg.height = this.game.height;
        titleBg.width = this.game.width;
        //load and play blackground music
/*        background_music = this.add.audio('background_music');
        background_music.play();*/

        //create a play button
        var playButton = this.game.add.sprite(319, 160, 'play button');
        playButton.x = this.game.width - 319;
        playButton.y = this.game.height - 160;
        playButton.inputEnabled = true;

        playButton.events.onInputDown.add(this.playGame,this);

       
    },
	
	   /**
     * playGame function that begins the gameplay state Game1
     * @method playGame
     * @return 
     */
    playGame: function() {
        this.game.state.start("Game2");
    }
};

},{}],10:[function(require,module,exports){
module.exports = {
    /**
  *Victory2 class. The victory1 object, final state of the game
  
  *@class victory2
  
  */

    /**
     * phaser create function  -- initializes the victory state, initialize victory image, text messages, and scores. Starts spawners. Creates 
     * @method create
     * @return 
     */
    create: function() {
        //get the cookie for high scores.
    /* Deprecated - Get high score data from cookies - Deprecated */  
        //highScores = Cookies.getJSON('high_scores_game2');
        responseArray = [];
    /* Send a POST request to the high score database
     * Returns a pipe-delimeted string of the top 5 scores (in order)
     * (ex: 2000|1000|750|565|20)
     */
        $.ajax({
            type: 'POST',
            url: "./db-api/savescores.php",
            data: "game=water&score=" + score,
            dataType: "text",
            success: function(data, status) {
                response = data;
                console.log("Data: " + data + "\nStatus: " + status);
            },
            async: false
        });
    // Split the XHR response if it was successfully received
        try {
            responseArray = (response).split("|");
        } catch (e) { // Otherwise, follow built-in error handling procedure
            responseArray = [score, -1, -1, -1];
        }

        if(responseArray[0] == undefined || responseArray == "NULL") {
            responseArray[0] = score;
        }
        if(responseArray[1] == undefined || responseArray == "NULL") {
            responseArray[1] = -1;
        }
        if(responseArray[2] == undefined || responseArray == "NULL") {
            responseArray[2] = -1;
        }
        if(responseArray[3] == undefined || responseArray == "NULL") {
            responseArray[3] = -1;
        }


        //background of the victory screen
        var victoryBg = this.add.sprite(this.game.width, this.game.height, 'victory page bg');
        victoryBg.x = 0;
        victoryBg.y = 0;
        victoryBg.height = this.game.height;
        victoryBg.width = this.game.width;

        //replay button
        var replayButton = this.game.add.sprite(513, 63, 'replay button');
        replayButton.x = (944 * this.game.width / 1024) - 513;
        replayButton.y = (590 * this.game.height / 768) - 63;
        replayButton.inputEnabled = true;

        //universal styling
        textStyle = {
            font: "48px Arial",
            fill: "#ffffff",
            align: "center"
        };

    // Deprecated 
        // var yourScore = this.game.add.text(431, 172, score + " points", textStyle);
        // yourScore.x = 12 * this.game.width / 20;
        // yourScore.y = 6.5 * this.game.height / 20;
        // yourScore.visible = true;
    // End Deprecated Code

    //Display the 4 highest scores that were pulled from the database.
        // If the scores didn't make it to the client for some reason, just display the user's current score.
        scores0 = this.game.add.text(11 * this.game.width / 20, 6.5 * this.game.height / 20, (responseArray[0] + " points").trim(), textStyle);
        scores0.visible = true;
        // Load up the high scores, but don't display them yet. 
        scores1 = this.game.add.text(11 * this.game.width / 20, 8 * this.game.height / 20, responseArray[1] + " points", textStyle);
        scores2 = this.game.add.text(11 * this.game.width / 20, 9.5 * this.game.height / 20, responseArray[2] + " points", textStyle);
        scores3 = this.game.add.text(11 * this.game.width / 20, 11 * this.game.height / 20, responseArray[3] + " points", textStyle);
        scores1.visible = false;
        scores2.visible = false;
        scores3.visible = false;

        //Display the high scores iff they made it back successfully and weren't equal to NULL
        if(responseArray[1] > 0) {
            scores1.visible = true;
        }
        if(responseArray[2] > 0) {
            scores2.visible = true;
        }
        if(responseArray[3] > 0) {
            scores3.visible = true;
        }

    // Show the user his/her score at the bottom of the results page
        this.game.add.text(this.game.width / 2 - 275, 6 * this.game.height / 7, "Your Score:       " + score + " points!", {font: "bold 60px Arial", fill:"#ffffff"})

        //add an input function to the replay menut to send back to the wrapper
        replayButton.events.onInputDown.add(this.restart, this);

    /* Deprecated - high scores using cookies - Deprecated */
        //push out the lowest score.
        // highScores.push(score);
        // highScores.sort();
        // highScores.splice(0, 1);
        // //store the three highest scores
        // Cookies.set('high_scores_game2', highScores);
    },

    //move to state wrapper.
    restart: function() {
        this.game.state.start('Wrapper');
    }
};

},{}],11:[function(require,module,exports){
module.exports = {
	/**
  *wrapper class. The wrapper object, first displayed screen
  the main menu screen
  
  *@class wrapper
  *@module game
  */
    /**
     * Phaser preload function. Preloads assets needed for wrapper
     * @method preload
     * @return 
     */
    preload: function () {
        //load images for all of the games here
        this.game.load.image("wrapper-bg", "assets/general/images/wrapper.jpg");
        this.game.load.image("new-game-thumb", "assets/general/images/new-game-thumbnail.jpg");
        this.game.load.image("UIP-thumb", "assets/game1/images/UIP-thumbnail.jpg");
        this.game.load.image("game2-thumbnail", "assets/game2/images/UIP-thumbnail.jpg");
    },
    /**
     * Phaser create function. Adds images needed for wrapper
     * @method create
     * @return returns boolean true if image successfully loads, false otherwise
     */
    create: function () {
        //create the background of the wrapper of the game's height and width
        wrapperBg = this.add.sprite(1024, 768, 'wrapper-bg');
        wrapperBg.x = 0;
        wrapperBg.y = 0;
        wrapperBg.height = this.game.height;
        wrapperBg.width = this.game.width;

        //create the thumbnail for the first game and enable functionality to move to next game
        var uipImage = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "UIP-thumb");
        uipImage.anchor.set(.5);
        //scale of the image, x, y
        uipImage.scale.setTo(.7, .7);
        //allow input
        uipImage.inputEnabled = true;
        //do something on click
        uipImage.events.onInputDown.add(this.captainSafetySelect, this);

        //create the thumbnail for the second game and enable functionality to move to next game
        var game2Image = this.game.add.sprite(this.game.width / 6, this.game.height / 2, "game2-thumbnail");
        game2Image.anchor.set(.5);
        game2Image.scale.setTo(.7, .7);
        game2Image.inputEnabled = true;
        game2Image.events.onInputDown.add(this.game2Start, this);


        //a blank image for a new game slot - no functionality because it shouldn't do anything
        var ngImageB = this.game.add.sprite(5 * this.game.width / 6, this.game.height / 2, "new-game-thumb");
        ngImageB.anchor.set(.5);
        ngImageB.scale.setTo(.7, .7);

        if (uipImage !== null && game2Image !== null && ngImageB !== null) {
            return true;
        } else {
            return false;
        }

    },
    /**
     * Function to start next state of game, "Preload1"
     * @method captainSafetySelect
    
     */
    captainSafetySelect: function () {

        this.game.state.start('Preload1');
    },

    //function that starts the game 2 state, preload.
    game2Start : function(){
        this.game.state.start('Preload2');
    }

}
},{}]},{},[2]);
