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
        it("Tests puzzle select div is hidden after photo is clicked", function() {
          $('.puzzle-img').click();
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
        it("Tests level select div is hidden after level is selected", function() {
          $("#easy-button").click();
          expect($("#level-select-container").css("display")).toEqual("none");
        });

        it("Tests that puzzle is visible after level is selected", function() {
          expect($("#board").css("display")).toEqual("block");
        });
    });
});
