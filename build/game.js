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

game.state.add('Preload3',require('./game3/preload3.js'));
game.state.add("Title3",require('./game3/title3.js'));
game.state.add("Game3",require('./game3/game3.js'));
game.state.add("Victory3",require('./game3/victory3.js'));

game.state.add('Boot', require('./boot.js'));
game.state.add('Wrapper', require('./wrapper.js'));
//start game in boot state.
game.state.start('Boot');
