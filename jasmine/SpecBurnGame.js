describe("Tests For Burn Prevention Game", function() {
  var player;
  var song;

  beforeEach(function() {
    player = new Player();
    song = new Song();
  });

  it("Test case for Jasmine", function() {
    player.play(song);
    expect(testFunction()).toEqual("test");

    //demonstrates use of custom matcher
    expect(player).toBePlaying(song);
  });
});
