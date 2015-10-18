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
                Cookies.set('high_scores_game2', [0, 0, 0]);
                Cookies.set('high_scores_game1', [0,0,0]);
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.setMinMax(480, 260, 1024, 768);
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;

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

var game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h,Phaser.CANVAS, "game-container");

game.globals = {
    //Add variables here that you want to access globally
    //score: 0 could be accessed as game.globals.score for example
};



//todo: later we can add an intermediate state which will serve as the wrapper and allow users to select
//which game they want to play, then start the preload state of that particular game
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
game.state.start('Boot');
},{"./boot.js":1,"./game1/game1.js":3,"./game1/preload1.js":4,"./game1/title1.js":5,"./game1/victory1.js":6,"./game2/game2.js":7,"./game2/preload2.js":8,"./game2/title2.js":9,"./game2/victory2.js":10,"./wrapper.js":11}],3:[function(require,module,exports){
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
        park = this.add.sprite(this.game.height, this.game.width, 'park');
        park.x = 0;
        park.y = 0;
        park.height = this.game.height;
        park.width = this.game.width;

        //
        unsafeChildren = this.game.add.group();
        safeChildren = this.game.add.group();
        //startx, starty, direction, group, spriteName, listener, path, pi)
        this.createChild(unsafeChildren, 'unsafe', this.onUnsafeClick, this.generatePath(), 0);
        //We can create spawn points wherever we want so the sprites start on paths etc.
        this.startSpawn(6, this.game.width, (this.game.height / 8), "left");
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



        //  Place score and timer in upper left hand corner
        scoreText = this.game.add.text(60, this.game.width / 50, 'Score: ' + score, {
            fill: '#666699'
        });
        clockText = this.game.add.text(200 + scoreText.width, this.game.width / 50, 'Time Remaining: ' + timeRemaining, {
            fill: '#666699'
        });
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

        // Allow game to be paused
        pause = this.game.add.text(240 + scoreText.width + clockText.width, this.game.width / 50, "Pause", {
            fill: '#666699'
        });
        pause.inputEnabled = true;
        pause.events.onInputDown.add(this.pauseGame, this);

        multiplierText = this.game.add.text(300 + scoreText.width + pause.width + clockText.width,
            this.game.width / 50, 'x' + this.multiplier, {
                fill: '#666699'
            });

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

            firstRateIncrease = true;
        }

        if (timeRemaining == (maxTime / 3) && secondRateIncrease == false) {
            bad_sound.play();
            this.startSpawn(3, this.game.width, (this.game.height / 8), "left");
            secondRateIncrease = true;

        }
        //also increase movement speed at 2/3 and 1/3 time
        if (timeRemaining <= (maxTime / 3)) {
            for (var i = 0; i < unsafeChildren.children.length; i++) {
                unsafeChildren.children[i].urgency = 7;
            }
            for (var i = 0; i < safeChildren.children.length; i++) {
                safeChildren.children[i].urgency = 7;
            }
        } else if (timeRemaining <= (2 * (maxTime / 3))) {
            for (var i = 0; i < unsafeChildren.children.length; i++) {
                unsafeChildren.children[i].urgency = 2;

            }
            for (var i = 0; i < safeChildren.children.length; i++) {
                safeChildren.children[i].urgency = 2;
            }


        }

        // Update score, timer, and victory texts with new values
        scoreText.text = 'Score: ' + score;
        clockText.text = 'Time Remaining: ' + timeRemaining;
        victoryText.text = 'Congratulations your score is ' + score + '!';
        multiplierText.text = 'x' + this.multiplier;

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

            if (currentChild.position.x > this.game.width) {
                if (!currentChild.safe) {
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
            if (currentChild.position.x > this.game.width) {
                if (!currentChild.safe) {
                    this.multiplier = 1;
                }
                currentChild.kill(); //weird stuff still happening with killing offscreen?
            }

        }
    },

    generatePath: function() {
        var game = this.game
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
        generateYPoint = function(sect) {
            return game.rnd.between((game.height / 2.5), (game.height * 9) / 10);
        };
        var yPoints = [];
        var xPoints = [];
        for (var i = 0; i <= 8; i++) {
            yPoints.push(generateYPoint(i));
            xPoints.push(generateXPoint(i));
        }
        var pathPts = {
            'y': yPoints,
            'x': xPoints
        };

        interpolatePaths = function(pathPts, game) {
            x = 1 / game.width;
            var truePath = [];
            for (var i = 0; i <= 1; i += x) {
                var px = game.math.catmullRomInterpolation(pathPts.x, i);
                var py = game.math.catmullRomInterpolation(pathPts.y, i);
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
        safeChild = this.createChild(safeChildren, newImage, this.onSafeClick, sprite.path, sprite.pi);
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
        this.createChild(group, spriteName, listener, this.generatePath(), 0);

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
     * @param {} spriteName name of the sprite the child will1  use
     * @param {} listener function to be executed when sprite is clicked
     *   
     */
    createChild: function(group, spriteName, listener, path, pi) {
        var child;
        //initialize properties
        child = group.create(0, 0, spriteName);
        child.inputEnabled = true;
        child.events.onInputDown.add(listener, this);
        child.pi = pi;
        child.urgency = 1;
        child.anchor.set(0.5);
        child.path = path;
        child.position.x = child.path[child.pi].x;
        child.position.y = child.path[child.pi].y;
        

        /*
                1024 x 768
                random point within 6 sections of x / y
                X ranges:
                    0.      0 -> 169 
                    1.      170 -> 340
                    2.      341 -> 511
                    3.      512 -> 682
                    4.      683 -> 853
                    5.      854 -> 1024
                Y ranges:
                    0.      0   -> 128
                    1.      128 -> 256
                    2.      256 -> 384
                    3.      384 -> 512
                    4.      512 -> 640
                    5.      640 -> 768
                

                water starts at 270 goes to 768
                
        */

        child.safe = false;
        //if creating a safe child
        if (spriteName == 'safeSkate' || spriteName == 'safe' || spriteName == 'safeATV') {
            child.safe = true;
        }
        this.game.physics.enable(child, Phaser.Physics.ARCADE, true);
        child.checkWorldBounds = true;
        child.outOfBoundsKill = true;
        if (spriteName == 'safe' || spriteName == 'unsafe') {
            //name, frames, fps, boolean for loop (true means plays more than once)
            child.animations.add('ride', [0, 1, 2, 3, 4], 4, true);
            scale = (this.game.width / 15) / 90;
            child.scale.x = scale * -1;
            child.scale.y = scale;
        } else if (spriteName == 'safeSkate' || spriteName == 'unsafeSkate') {
            scale = (this.game.width / 15) / 90;
            child.animations.add('ride', [0, 1, 2, 3, 4, 5], 5, true);
            child.scale.x = scale;
            child.scale.y = scale;
        } else if (spriteName == 'safeATV' || spriteName == 'unsafeATV') {
            scale = (this.game.width / 15) / 90;
            child.animations.add('ride', [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true);
            child.scale.x = scale;
            child.scale.y = scale;
        }



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
        this.game.load.image('title page bg', './assets/game1/images/UIP-title.jpg');
        this.game.load.image('park', './assets/game1/images/park-bg.jpg');
        this.game.load.image('instructions', './assets/game1/images/instructions.jpg');
        this.game.load.audio('bad_sound', './assets/general/audio/bad-sound.wav', true);
		this.game.load.audio('good_sound', './assets/general/audio/good_sound.wav', true);
        this.game.load.spritesheet('safe', './assets/game1/images/spritesheets/safe-biker-red.png', 80, 80);
        this.game.load.spritesheet('unsafe', './assets/game1/images/spritesheets/unsafe-biker-red.png', 80, 80);
		this.game.load.spritesheet('safeSkate', './assets/game1/images/spritesheets/safe-skater.png', 90, 90);
		this.game.load.spritesheet('unsafeSkate', './assets/game1/images/spritesheets/unsafe-skater.png', 90, 90);
		this.game.load.spritesheet('safeATV', './assets/game1/images/spritesheets/safe-atv-rider.png', 90, 90);
		this.game.load.spritesheet('unsafeATV', './assets/game1/images/spritesheets/unsafe-atv-rider.png', 90, 90);
        this.game.load.image('replay button', './assets/game1/images/UIP-replay-button.png');
        this.game.load.image('victory page bg', './assets/game1/images/UIP-victory.jpg');

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
        highScores = Cookies.getJSON('high_scores_game1')
        //highScores = [150, 80, 10];
        var victoryBg = this.add.sprite(this.game.width, this.game.height, 'victory page bg');
        victoryBg.x = 0;
        victoryBg.y = 0;
        victoryBg.height = this.game.height;
        victoryBg.width = this.game.width;

        var replayButton = this.game.add.sprite(513, 63, 'replay button');
        replayButton.x = 12 * this.game.width / 20;
        replayButton.y = 14.5 * this.game.height / 20;
        replayButton.inputEnabled = true;

        textStyle = {
            font: "48px Arial",
            fill: "#ffffff",
            align: "center"
        };
        var yourScore = this.game.add.text(431, 172, score + " points", textStyle);
        yourScore.x = 12 * this.game.width / 20;
        yourScore.y = 6.5 * this.game.height / 20;
        yourScore.visible = true;


        scores1 = this.game.add.text(12 * this.game.width / 20, 8 * this.game.height / 20, highScores[2] + " points", textStyle);
        scores1.visible = true;
        scores2 = this.game.add.text(12 * this.game.width / 20, 9.5 * this.game.height / 20, highScores[1] + " points", textStyle);
        scores2.visible = true;
        scores3 = this.game.add.text(12 * this.game.width / 20, 11 * this.game.height / 20, highScores[0] + " points", textStyle);
        scores3.visible = true;

        highScores.push(score);
        highScores.sort();
        highScores.splice(0, 1);
        Cookies.set('high_scores_game1', highScores);

        replayButton.events.onInputDown.add(this.restart, this);
    },
    restart: function() {
        this.game.state.start('Wrapper');
    }
};

},{}],7:[function(require,module,exports){
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
        park = this.add.sprite(this.game.height, this.game.width, 'lake');
        park.x = 0;
        park.y = 0;
        park.height = this.game.height;
        park.width = this.game.width;

        //
        unsafeChildren = this.game.add.group();
        safeChildren = this.game.add.group();
        //startx, starty, direction, group, spriteName, listener, path, pi)
        this.createChild(unsafeChildren, 'boy_boater_unsafe', this.onUnsafeClick, this.generatePath(), 0);
        //We can create spawn points wherever we want so the sprites start on paths etc.
        this.startSpawn(6, this.game.width, (this.game.height / 8), "left");
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



        //  Place score and timer in upper left hand corner
        scoreText = this.game.add.text(60, this.game.width / 50, 'Score: ' + score, {
            fill: '#666699'
        });
        clockText = this.game.add.text(200 + scoreText.width, this.game.width / 50, 'Time Remaining: ' + timeRemaining, {
            fill: '#666699'
        });
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

        // Allow game to be paused
        pause = this.game.add.text(240 + scoreText.width + clockText.width, this.game.width / 50, "Pause", {
            fill: '#666699'
        });
        pause.inputEnabled = true;
        pause.events.onInputDown.add(this.pauseGame, this);

        multiplierText = this.game.add.text(300 + scoreText.width + pause.width + clockText.width,
            this.game.width / 50, 'x' + this.multiplier, {
                fill: '#666699'
            });

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

            firstRateIncrease = true;
        }

        if (timeRemaining == (maxTime / 3) && secondRateIncrease == false) {
            bad_sound.play();
            this.startSpawn(3, this.game.width, (this.game.height / 8), "left");
            secondRateIncrease = true;

        }
        //also increase movement speed at 2/3 and 1/3 time
        if (timeRemaining <= (maxTime / 3)) {
            for (var i = 0; i < unsafeChildren.children.length; i++) {
                unsafeChildren.children[i].urgency = 7;
            }
            for (var i = 0; i < safeChildren.children.length; i++) {
                safeChildren.children[i].urgency = 7;
            }
        } else if (timeRemaining <= (2 * (maxTime / 3))) {
            for (var i = 0; i < unsafeChildren.children.length; i++) {
                unsafeChildren.children[i].urgency = 2;

            }
            for (var i = 0; i < safeChildren.children.length; i++) {
                safeChildren.children[i].urgency = 2;
            }


        }

        // Update score, timer, and victory texts with new values
        scoreText.text = 'Score: ' + score;
        clockText.text = 'Time Remaining: ' + timeRemaining;
        victoryText.text = 'Congratulations your score is ' + score + '!';
        multiplierText.text = 'x' + this.multiplier;

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
                currentChild.animations.play('row');

            }

            if (currentChild.position.x > this.game.width) {
                if (!currentChild.safe) {
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
                currentChild.animations.play('row');

            }
            // Ensure kill of screen sprites
            if (currentChild.position.x > this.game.width) {
                if (!currentChild.safe) {
                    this.multiplier = 1;
                }
                currentChild.kill(); //weird stuff still happening with killing offscreen?
            }

        }
    },

    generatePath: function() {
        var game = this.game
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
        generateYPoint = function(sect) {
            return game.rnd.between((game.height / 2.5), (game.height * 9) / 10);
        };
        var yPoints = [];
        var xPoints = [];
        for (var i = 0; i <= 8; i++) {
            yPoints.push(generateYPoint(i));
            xPoints.push(generateXPoint(i));
        }
        var pathPts = {
            'y': yPoints,
            'x': xPoints
        };

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
        if (this.multiplier !== 20) {
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
     * function to create a child, called by create random child. Gives x y coordinates, direction to move in, group belongs to, name of image, and function to call when clicked
     *Precondition: startx, starty are valid positive integers, and direction is "up" "down" "left" "right" "up-left" "up-right" "down-left" "down-right" group is a valid child group, spriteName is a valid sprite, and listener is a valid function call
     *Postcondition: Group size is increased by one
     * @method createChild
     * @param {} startx x coordinate
     * @param {} starty y coordinate
     * @param {} direction direction the child will move in
     * @param {} group group the child will belong to
     * @param {} spriteName name of the sprite the child will1  use
     * @param {} listener function to be executed when sprite is clicked
     *   
     */
    createChild: function(group, spriteName, listener, path, pi) {
        var child;
        //initialize properties
        child = group.create(0, 0, spriteName);
        child.inputEnabled = true;
        child.events.onInputDown.add(listener, this);
        child.pi = pi;
        child.urgency = 1;
        child.anchor.set(0.5);
        child.path = path;
        child.position.x = child.path[child.pi].x;
        child.position.y = child.path[child.pi].y;
        

        /*
                1024 x 768
                random point within 6 sections of x / y
                X ranges:
                    0.      0 -> 169 
                    1.      170 -> 340
                    2.      341 -> 511
                    3.      512 -> 682
                    4.      683 -> 853
                    5.      854 -> 1024
                Y ranges:
                    0.      0   -> 128
                    1.      128 -> 256
                    2.      256 -> 384
                    3.      384 -> 512
                    4.      512 -> 640
                    5.      640 -> 768
                

                water starts at 270 goes to 768
                
        */

        child.safe = false;
        //if creating a safe child
        if (spriteName == 'boy_boater_safe' || spriteName == 'girl_boater_safe') {
            child.safe = true;
        }
        this.game.physics.enable(child, Phaser.Physics.ARCADE, true);
        child.checkWorldBounds = true;
        child.outOfBoundsKill = true;
        if (spriteName == 'boy_boater_safe' || spriteName == 'boy_boater_unsafe') {
            //name, frames, fps, boolean for loop (true means plays more than once)
            child.animations.add('row', [0, 1, 2, 3, 4], 4, true);
            scaleX = (this.game.width / 15) / 115;
            scaleY = (this.game.width / 15) / 120;
            child.scale.x = scaleX;
            child.scale.y = scaleY;
        } else if (spriteName == 'girl_boater_safe' || spriteName == 'girl_boater_unsafe') {
            //name, frames, fps, boolean for loop (true means plays more than once)
            child.animations.add('row', [0, 1, 2, 3, 4], 4, true);
            scaleX = (this.game.width / 15) / 115;
            scaleY = (this.game.width / 15) / 120;
            child.scale.x = scaleX;
            child.scale.y = scaleY;
        }



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

},{}],8:[function(require,module,exports){
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
        this.game.load.image('title page bg', './assets/game1/images/UIP-title.jpg');
        this.game.load.image('lake', './assets/game2/images/background.png');
        this.game.load.image('instructions', './assets/game1/images/instructions.jpg');
        this.game.load.audio('bad_sound', './assets/general/audio/bad-sound.wav', true);
        this.game.load.audio('good_sound', './assets/general/audio/good_sound.wav', true);
        this.game.load.spritesheet('girl_boater_safe', './assets/game2/images/spritesheets/safe_boat_girl.png', 108, 115);
        this.game.load.spritesheet('girl_boater_unsafe', './assets/game2/images/spritesheets/unsafe_boat_girl.png', 108, 115);
        this.game.load.spritesheet('boy_boater_safe', './assets/game2/images/spritesheets/safe_boat_boy.png', 108, 115);
        this.game.load.spritesheet('boy_boater_unsafe', './assets/game2/images/spritesheets/unsafe_boat_boy.png', 108, 115);
        this.game.load.image('replay button', './assets/game1/images/UIP-replay-button.png');
        this.game.load.image('victory page bg', './assets/game1/images/UIP-victory.jpg');

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
        this.game.state.start("Game2");
    }
};

},{}],10:[function(require,module,exports){
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
        highScores = Cookies.getJSON('high_scores_game2');
        //highScores = [150, 80, 10];
        var victoryBg = this.add.sprite(this.game.width, this.game.height, 'victory page bg');
        victoryBg.x = 0;
        victoryBg.y = 0;
        victoryBg.height = this.game.height;
        victoryBg.width = this.game.width;

        var replayButton = this.game.add.sprite(513, 63, 'replay button');
        replayButton.x = 12 * this.game.width / 20;
        replayButton.y = 14.5 * this.game.height / 20;
        replayButton.inputEnabled = true;

        textStyle = {
            font: "48px Arial",
            fill: "#ffffff",
            align: "center"
        };
        var yourScore = this.game.add.text(431, 172, score + " points", textStyle);
        yourScore.x = 12 * this.game.width / 20;
        yourScore.y = 6.5 * this.game.height / 20;
        yourScore.visible = true;


        scores1 = this.game.add.text(12 * this.game.width / 20, 8 * this.game.height / 20, highScores[2] + " points", textStyle);
        scores1.visible = true;
        scores2 = this.game.add.text(12 * this.game.width / 20, 9.5 * this.game.height / 20, highScores[1] + " points", textStyle);
        scores2.visible = true;
        scores3 = this.game.add.text(12 * this.game.width / 20, 11 * this.game.height / 20, highScores[0] + " points", textStyle);
        scores3.visible = true;

        replayButton.events.onInputDown.add(this.restart, this);
        highScores.push(score);
        highScores.sort();
        highScores.splice(0, 1);
        Cookies.set('high_scores_game2', highScores);
    },
    restart: function() {
        this.game.state.start('Wrapper');
    }
};

},{}],11:[function(require,module,exports){
module.exports = {
	/**
  *wrapper class. The wrapper object, first displayed screen
  
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
        this.game.load.image("UIP-thumb", "assets/general/images/UIP-thumbnail.jpg");
        this.game.load.image("game2-thumbnail", "assets/general/images/game2-thumbnail.jpg");
    },
    /**
     * Phaser create function. Adds images needed for wrapper
     * @method create
     * @return returns boolean true if image successfully loads, false otherwise
     */
    create: function () {

        wrapperBg = this.add.sprite(1024, 768, 'wrapper-bg');
        wrapperBg.x = 0;
        wrapperBg.y = 0;
        wrapperBg.height = this.game.height;
        wrapperBg.width = this.game.width;


        var uipImage = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "UIP-thumb");
        uipImage.anchor.set(.5);
        uipImage.scale.setTo(.7, .7);
        uipImage.inputEnabled = true;
        uipImage.events.onInputDown.add(this.captainSafetySelect, this);

        var game2Image = this.game.add.sprite(this.game.width / 6, this.game.height / 2, "game2-thumbnail");
        game2Image.anchor.set(.5);
        game2Image.scale.setTo(.7, .7);
        game2Image.inputEnabled = true;
        game2Image.events.onInputDown.add(this.game2Start, this);



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

    //
    game2Start : function(){
        this.game.state.start('Preload2');
    }

}
},{}]},{},[2]);
