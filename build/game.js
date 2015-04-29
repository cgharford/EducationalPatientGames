var w = window.innerWidth * window.devicePixelRatio, h = window.innerHeight * window.devicePixelRatio;

var game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h,Phaser.CANVAS, "game-container");

game.globals = {
    get: require('./game1/getFromServer.js'),
    post: require('./game1/postToServer.js'),
    scores: {score1: "", score2: "", score3: "", score4: ""}
    //Add variables here that you want to access globally
    //score: 0 could be accessed as game.globals.score for example
};



//todo: later we can add an intermediate state which will serve as the wrapper and allow users to select
//which game they want to play, then start the preload state of that particular game
game.state.add('Preload1',require('./game1/preload1.js'));
game.state.add("Title1",require('./game1/title1.js'));
game.state.add("Game1",require('./game1/game1.js'));
game.state.add("Victory1",require('./game1/victory1.js'));
game.state.add('Boot', require('./boot.js'));
game.state.add('Wrapper', require('./wrapper.js'));
game.state.start('Boot');