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
        this.urgency = 1;
        this.multiplier = 1;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        firstRateIncrease = false;
        secondRateIncrease = false;
        this.lives = 3;
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
        this.startSpawn(3, this.game.width, (this.game.height / 8), "left");
        // Alternate Path

        // this.createShifter(6 * (this.game.width / 12), 23 * this.game.height / 24, "up-left", false, true);
        // this.createShifter(4 * this.game.width / 12, 4.7 * this.game.height / 9, "left", true, false);
        /*
         This will allow to check num of living unsafe children to see if offscreen are killed
         this.game.time.events.loop(Phaser.Timer.SECOND * 3, this.announceLiving);
         */

        //Add funky negative sound and positive sound
        good_sound = this.add.audio('good_sound');
        bad_sound = this.add.audio('bad_sound');
        game_over = this.add.audio('game_over');

        // Score starts at 0, timer starts at 60 seconds
        score = 0;
        timeRemaining = 60;
        maxTime = timeRemaining
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
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTime, this);

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
            this.startSpawn(1.5, this.game.width, (this.game.height / 8), "left");

            firstRateIncrease = true;
        }

        if (timeRemaining == (maxTime / 3) && secondRateIncrease == false) {
            this.startSpawn(1.5, this.game.width, (this.game.height / 8), "left");
            secondRateIncrease = true;

        }

        // Update score, timer, and victory texts with new values
        scoreText.text = 'Score: ' + score;
        clockText.text = 'Time Remaining: ' + timeRemaining;
        victoryText.text = 'Congratulations your score is ' + score + '!';

        // If timer runs out, show victory
        if (timeRemaining <= 0 || this.lives == 0) {
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
                this.multiplier += 1;
                score += 10 * this.multiplier;
                currentChild.kill(); //weird stuff still happening with killing offscreen?
                safeChildren.remove(currentChild);
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
        victoryText.visible = true;
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
        child.urgency = this.urgency;
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
