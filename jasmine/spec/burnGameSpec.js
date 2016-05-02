// Jasmine unit tests for burn prevention game

describe("Tests for Burn Prevention Game (must be run in order)", function() {
    it("Tests test function in Puzzle.js", function() {
      expect(testTesters()).toEqual("Test Worked!");
    });

    describe("Select puzzle test", function() {
        var playing, somethingAsyncWithCallback = function(callback) {
                playing = !audioElement.paused && !audioElement.ended && 0 < audioElement.currentTime;
            callback();
        };

        beforeEach(function(done) {
            setInterval(function(){
                somethingAsyncWithCallback(done);
            }, 1000);
        });

        it("Tests that instructional audio for puzzle select is playing", function() {
            expect(playing).toEqual(true);
        });

        it("Tests that the level select box is hidden", function() {
          expect($("#level-select-container").css("display")).toEqual("none");
        });

        it("Tests that 5 puzzles have loaded on the page", function() {
          expect($('.puzzle-img').length).toEqual(5);
        });
    });

    describe("Select test", function() {
        var playing, somethingAsyncWithCallback = function(callback) {
                playing = !audioElement.paused && !audioElement.ended && 0 < audioElement.currentTime;
            callback();
        };

        beforeEach(function(done) {
            $('.puzzle-img').click();
            setInterval(function(){
                somethingAsyncWithCallback(done);
            }, 2000);
        });

        it("Tests that instructional audio for level select is playing", function() {
            expect(playing).toEqual(true);
        });

        it("Tests puzzle select div is hidden after photo is clicked", function() {
          expect($("#puzzle-select-container").css("display")).toEqual("none");
        });

        it("Tests that level select div is visible after photo is clicked", function() {
          expect($("#level-select-container").css("display")).toEqual("block");
        });

        it("Tests that 5 level options have loaded on the page", function() {
          expect($('.level-button').length).toEqual(5);
        });
    });

    describe("Assemble puzzle test", function() {
        var playing, somethingAsyncWithCallback = function(callback) {
                playing = !audioElement.paused && !audioElement.ended && 0 < audioElement.currentTime;
            callback();
        };

        beforeEach(function(done) {
            $("#easy-button").click();
            setInterval(function(){
                somethingAsyncWithCallback(done);
            }, 2000);
        });

        it("Tests that instructional audio for puzzle is playing", function() {
            expect(playing).toEqual(true);
        });

        it("Tests level select div is hidden after level is selected", function() {
          expect($("#level-select-container").css("display")).toEqual("none");
        });

        it("Tests that puzzle is visible after level is selected", function() {
          expect($("#board").css("display")).toEqual("block");
        });
    });

    describe("Identify dangerous area test", function() {
        var playing, somethingAsyncWithCallback = function(callback) {
                playing = !audioElement.paused && !audioElement.ended && 0 < audioElement.currentTime;
            callback();
        };

        beforeEach(function(done) {
            $("#skip").click();
            setInterval(function() {
                somethingAsyncWithCallback(done);
            }, 2000);
        });

        it("Tests that instructional audio for dangerous area identification is playing", function() {
            expect(playing).toEqual(true);
        });

        it("Tests puzzle is hidden after 'skip' button in clicked", function() {
          expect($("#board").css("display")).toEqual("none");
        });

        it("Tests that the clickable image is visible after 'skip' is clicked", function() {
          expect($("#click-puzzle").css("display")).toEqual("block");
        });

        it("Tests that the image background is visible after 'skip' is clicked", function() {
          expect($("#stove-img").css("display")).toEqual("inline");
        });

        it("Tests that the image animations is visible after 'skip' is clicked", function() {
          expect($("#stove-img-anim").css("display")).toEqual("block");
        });
    });
});
