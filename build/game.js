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