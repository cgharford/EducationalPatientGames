
var game = new Phaser.Game(600,600,Phaser.CANVAS,'index',{preload: preload, create: create, update: update});

function preload() {
    //  game.load.image('background','./game1/assets/blackbg.png');
    game.load.image('safe','./game1/assets/bluesquare.png');
    game.load.image('unsafe','./game1/assets/redsquare.png'); //todo:  load these as spritesheets and add animtions
}

var safeChildren;
var unsafeChildren;
var score;
var scoreText;
var errorText;
var errorTextTimer;

function create() {
    safeChildren = game.add.group();
    for (var i = 0; i < 3; i++) {
        var safeChild = safeChildren.create(game.world.randomX, game.world.randomY, 'safe');
        safeChild.inputEnabled = true;
        safeChild.events.onInputDown.add(onSafeClick,this); //onSafeClick is the callback function, this the sprite that was clicked
    }
    safeChildren.setAll('scale.x',0.25); //ideally the real sprites will be designed so no scaling is necessary
    safeChildren.setAll('scale.y',0.25);
    safeChildren.setAll('outOfBoundsKill',true);

    unsafeChildren = game.add.group();
    for (var i = 0; i < 3; i++) {
        var unsafeChild = unsafeChildren.create(game.world.randomX, game.world.randomY, 'unsafe');
        unsafeChild.inputEnabled = true;
        unsafeChild.events.onInputDown.add(onUnsafeClick,this);
    }
    unsafeChildren.setAll('scale.x',0.25);
    unsafeChildren.setAll('scale.y',0.25);
    unsafeChildren.setAll('outOfBoundsKill',true);

    score = 0;
    scoreText = game.add.text(0,0,'Score:' + score,{fill: '#ffffff'});
    errorText = game.add.text(game.width/2,game.height/2,'Error that person was performing \na safe activity!',
        {font: '16px Arial', fill: '#ffffff', align: 'center'});
    errorText.visible = false;
    errorText.anchor.set(0.5);
}

function update() {
    scoreText.text = 'Score:' + score;
    if ((errorText.visible == true) && (game.time.now > errorTextTimer))
        errorText.visible = false;
}

function onSafeClick(sprite) {
    score -= 1; //todo: make error text display when a safe child is clicked
    errorTextTimer = game.time.now + 500; //error text will be displayed for 500 ms when a safe child is clicked
    errorText.visible = true;
}

function onUnsafeClick(sprite) {
    score += 1;
    var safeChild = safeChildren.create(sprite.position.x,sprite.position.y,'safe');
    safeChild.inputEnabled = true;
    safeChild.events.onInputDown.add(onSafeClick,this);
    safeChild.scale.x = 0.25;
    safeChild.scale.y = 0.25;
    safeChild.outOfBoundsKill = true;
    sprite.kill(); //todo: implement a sprite recycling mechanism with some maximum amount of safe and unsafe sprites visible at a time
}
