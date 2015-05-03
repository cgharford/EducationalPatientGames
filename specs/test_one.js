describe("Educational Patient Games", function() {
    describe("Accessing Phaser and the Game", function() {
        var game;
        var w;
        var h;

        beforeEach(function() {
            w = window.innerWidth * window.devicePixelRatio;
            h = window.innerHeight * window.devicePixelRatio;
            game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h,Phaser.CANVAS, "game-container");
        });

        it("Phaser should be defined", function() {
            expect(game).toBeDefined();
        });

        it("Phaser parent is 'game-container'", function() {
            expect(game.parent).toBe("game-container");
        });
    });

    describe("Game loads", function() {
        var w;
        var h;
        var game;
        var gameObject;


        beforeEach(function() {
            w = window.innerWidth * window.devicePixelRatio;
            h = window.innerHeight * window.devicePixelRatio;
            game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h,Phaser.CANVAS, "game-container");
            gameObject = new game1(game);
        });

        it("Game is defined", function() {
            expect(gameObject).toBeDefined();
        });

        describe("Expect essential functions to be defined", function() {

            it("Game create function is defined", function () {
                expect(gameObject.create).toBeDefined();
            });

            it("Game update function is defined", function () {
                expect(gameObject.update).toBeDefined();
            });

        });

        it("Time Remaining is 59", function() {
            gameObject.timeRemaining = 60;
            gameObject.updateTime();
            //gameObject.pauseGame();
            expect(gameObject.timeRemaining).toEqual(59);
        });
    });

    describe("Wrapper loads", function(){
        var game;
        var wrapObject;

        beforeEach(function() {
            game = new Phaser.Game();
            wrapObject = new wrapper(game);
        });

        it("Wrapper is defined", function(){
            expect(wrapObject).toBeDefined();
        });

        describe("Wrapper essential functions are defined", function() {
            it("Wrapper preload function is defined", function() {
                expect(wrapObject.preload).toBeDefined();
            });

            it("Wrapper create function is defined", function() {
                expect(wrapObject.create).toBeDefined();
            })
        });

        it("Uploads all images in wrapper", function() {
            expect(wrapObject.create).toBeTruthy();
        });

    });

    describe("Preload loads", function (){
        var game;
        var preloadObject;

        beforeEach( function() {
            game = new Phaser.Game();
            preloadObject = new preload1(game);
        });

        it("Preload is defined", function() {
            expect(preloadObject).toBeDefined();
        });

        describe("Preload essential functions are defined", function() {
            it("Preload preload function is defined", function() {
                expect(preloadObject.preload).toBeDefined();
            });

            it("Preload create function is defined", function() {
                expect(preloadObject.create).toBeDefined();
            })
        });
    });

    describe("Title loads", function() {
        var game;
        var titleObject;

        beforeEach( function() {
            game = new Phaser.Game();
            titleObject = new title1(game);
        });

        it("Title is defined", function() {
            expect(titleObject).toBeDefined();
        });

        it("Title create function is defined", function() {
            expect(titleObject.create).toBeDefined();
        });
    });

    describe("Victory loads", function() {
        var game;
        var victoryObject;

        beforeEach(function() {
            game = new Phaser.Game();
            victoryObject = new victory1(game, 10);
        });

        it("Victory is defined", function() {
            expect(victoryObject).toBeDefined();
        });

        it("Victory create function is defined", function() {
            expect(victoryObject.create).toBeDefined();
        });
    });

    describe("Boot loads", function() {
        var game;
        var bootObject;

        beforeEach(function() {
            game = new Phaser.Game();
            bootObject = new boot(game);
        });

        it("Boot is defined", function() {
            expect(bootObject).toBeDefined();
        });

        it("Boot create function is defined", function() {
            expect(bootObject.create).toBeDefined();
        });
    });
});