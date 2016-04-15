describe("Tests for Burn Prevention Game (must be run in order)", function() {
    it("Tests test function in Puzzle.js", function() {
      expect(testTesters()).toEqual("Test Worked!");
    });

    describe("Select puzzle test", function() {
        it("Tests that the level select box is hidden", function() {
          expect($("#level-select-container").css("display")).toEqual("none");
        });

        it("Tests that 5 puzzles have loaded on the page", function() {
          expect($('.puzzle-img').length).toEqual(5);
        });
    });

    describe("Select test", function() {
        beforeEach(function() {
            $('.puzzle-img').click();
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
        beforeEach(function() {
            $("#easy-button").click();
        });

        it("Tests level select div is hidden after level is selected", function() {
          expect($("#level-select-container").css("display")).toEqual("none");
        });

        it("Tests that puzzle is visible after level is selected", function() {
          expect($("#board").css("display")).toEqual("block");
        });
    });

    describe("Identify dangerous area test", function() {
        beforeEach(function() {
          $("#skip").click();
        });

        it("Tests puzzle is hidden after 'skip' button in clicked", function() {
          expect($("#board").css("display")).toEqual("none");
        });

        it("Tests that the clickable image is visible after 'skip' is clicked", function() {
          expect($("#click-puzzle").css("display")).toEqual("block");
        });

        it("Tests that 'skip' button is hidden after being clicked", function() {
          expect($("#skip").css("display")).toEqual("none");
        });
    });
});
