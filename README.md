
Navigation
----

1. [Description](#sect1)
2. [Documentation](#doc)
  1. [Making Changes](#doc-a)
  2. [The Code itself](#doc-b)
    1. [Menus](#doc-b-a)
      1. [Game.js](#doc-b-a-a)
      2. [Boot.js](#doc-b-a-b)
      3. [Wrapper.js](#doc-b-a-c)
    2. [Games](#doc-b-b)
      1. [Preload.js](#doc-b-b-a)
      2. [Game.js](#doc-b-b-b)
      3. [Title.js](#doc-b-b-c)
      4. [Victory.js](#doc-b-b-d)
  3. [Design Decisions](#doc-c)
    1. [Spawning](#doc-c-a)
    2. [Scoring](#doc-c-b)
    3. [Lives](#doc-c-c)
    4. [Optimal Gameplay Environment](#doc-c-d)
2. [Game Installation](#game-install)
  1. [Prerequisites and Dependencies](#req)
  2. [Running the Game](#run)
    1. [Locally](#local)
    2. [Remotely](#remote)
3. [Contributors](#authors)
  1. [Spring 2015](#s15)
  2. [Fall 2015](#f15)
4. [Extending](#ext)

Description <a id="sect1"></a>
----

A game created at the behest of UNC hospitals to encourage safe standards such as wearing a lifejacket every time you're on the water, or wearing a helmet every time you ride.

Documentation<a id="doc"></a>
----

####Making Changes<a id="doc-a"></a>

To make changes to existing code, it is a fairly simple process: Edit the appropriate file listed below with the changes you'd like to make.

####The Code Itself<a id="doc-b"></a>

The code is fairly verbose due to the nature of the Phaser platform. Below is a description of the way the code is organized and how to properly make additions or changes to the game within the code.

#####Menu <a id="doc-b-a"></a>

Menus - The Game menus and everything that is common to all games, including those that should be added later.

===

#####Game.js<a id="doc-b-a-a"></a>

Game.js is the very first file that is created. It defines the states that are added to the game, defines the game as a global JavaScript variable, and it defines a proper aspect ratio. All globals that need to be added to the game should be added here as well.

===

#####Boot.js<a id="doc-b-a-b"></a>


Boot.js is the file that is loaded before all other files. It defines various common properies to all games. Examples of common properties are the cookies used to store the high scores (if applicable) and the overall scale of the game. This file has 4 main methods.

```javascript
function init() {
  /* This method is executed first as defined by phaser's documentation of 
  the two existing methods in the file - it defines all
  properties that should be created before the game is initialized.
  
  Additionally, this function is a void method - it should return nothing.
  
  */
}

function create(){
  /*
    create is called last as defined by Phaser's documentation of the two methods. 
    Currently this method is just used to properly start the game by moving it to the
    next state, 'Wrapper' (wrapper.js).
  */
}

function enterIncorrectOrientation(){
  /*
    This method just defines a style that should be applied 
    should the device be rotated to an incorrect state.  This is the case when users
    on mobile devices are holding their device in portrait orientation.
  */
}

function leaveIncorrectOrientation(){
  /*
    This method just defines a style that should be applied 
    should the device be rotated from an incorrect state to a correct state.
  */
}
```

===

#####Wrapper.js<a id="doc-b-a-c"></a>

Wrapper.js defines the start menu - the overall splash screen of the game that allows the user to pick 
an individual game to begin playing. All games should return to this state after their victory screen. 

```javascript

function preload(){
  /*
    This code is executed before the game area is created
    This method should be used to only load in assets or game mechanics,
    like gravity, or spawning.
  */
}

function create(){
  /*
    This is what creates the game area, or the menu itself
    It has three sections which act as buttons.  Upon clicking, they cause the 
    game to swap states to the game selected
  */
}

```

===

###Games <a id="doc-b-b"></a>

Each game should be defined as four files located under build/.  The four files emulate Phaser's own style.

The first file, preload, should define all assets for the game, and then move to the title state.

The second file, title, should create a splash scren with a 'play' button.  When the user clicks this button, it advances to the proper game.

The third file, game, should define everything about the game. This is the actualy game. After the victory or loss condition is achieved, the next state should be victory.

The fourth file, victory, defines the high score screen and deals with moving the scores to a high scores server or cookie and display at least the top two high scores. After this state, it should be moved back to wrapper so that the user has an option to move to a different game.

===

####Preload.js <a id="doc-b-b-a"></a>

preload.js should have only one method - preload - plus optional helper methods.  This method loads the assets to be used in the game. It should automatically advance the game without any human input to the next state

```javascript

function preload() {
  /*
    Asset loading goes here
  */
}

```

===

####Title.js <a id="doc-b-b-b"></a>

title.js should have only one method - create - plus optional helper methods.  This method creates the entirety of the title splash screen. It should have some way to transition to the next state in response to user input.

```javacript
function create(){
  /*
    Stuff that needs to be created to create the title screen (such as a screen background) goes here
  */
}
```

===

####Game.js <a id="doc-b-b-c"></a>

Game.js Defines everything about the game - mechanics, lives, utilizing assets, etc. It uses Phaser's three method definition of a game. The three methods are preload, create, and update.

```javascript

function preload(){
/*
  loading assets into common variables, and establishing constants for the game should be done here.
  This is called only once.
*/
}

function create(){
/*
  Creating the game arena along with physics engines and the creation of game mechanics should be done here.
  This is called only once, at the state being created.
*/
}

function update(){
  /*
  This is called once a tick - it should define how the game changes at each moment. 
  For example, in game 1 and game 2, it defines the movement of each character along 
  with creating spawners at certain intervals of time. 
  */
}

```

===

####Victory.js <a id="doc-b-b-d"></a>

Victory defines a static screen for high scores and the display of the users score. It should have one method plus optional helper methods.

```javascript
  
function create() {
  /*
    This function defines the look and functionality of the static screen. It is called only once.
  */
}
  
```

===

Design Decisions <a id="doc-c"></a>
----

####Spawning: <a id="doc-c-a"></a>

Sprites spawn from the left side of the screen at set time intervals.  It is helpful to think of an entity (a spawner) as the "creator" of Sprites that appear on the screen.  Initially (as soon as the game begins), there is one spawner creating Sprites at a rate of 1 Sprite every 3 seconds.  (Note that spawn times are predictable; not random within an interval).  After 20 seconds of gameplay, an additional spawner is added that creates a Sprite every 1.5 seconds.  This operates in tandem with the original spawner, meaning a total of 3 Sprites appear ever 3 seconds (1 from the first spawner and 2 from the second spawner).  After 20 more seconds, a third spawner is added that also generates a Sprite every 1.5 seconds.  Thus, for the remainder of the game, 5 Sprites spawn every 3 seconds.  

Sprites begin at a random location along the left side of the screen, and move in a randomly-generated bezier path to the right side of the screen.  The speed at which Sprites move increments by 1 unit every 5 seconds.  While the units of speed are arbitrary, the speed value must be a whole number.  We have found that incrementing by 1 unit every 5 seconds allows for a smooth, linear speed-up while ensuring that the game does not become overwhelming during the last few seconds. 

Sprites and spawning behaves the same way for both the Helmet Safety and the Water Safety levels.

===

####Scoring: <a id="doc-c-b"></a>

Players get points for clicking on unsafe Sprites or not clicking on already-safe Sprites.  The specific number of points awarded depends on the player's current score multiplier.  

Initially the multiplier is equal to 0.  When the user clicks on an unsafe Sprite or allows a safe Sprite to exit the screen, he/she receives points equal to 10 times the current multiplier value, and the multiplier increments by 1.  

Once the multiplier reaches 20, it is no longer incremented.  This is the maximum possible value of the score multiplier.

If the player clicks on an already-safe Sprite or allows an unsafe Sprite to exit the screen, the score multiplier resets to 1.  

===

####Lives: <a id="doc-c-c"></a>

Players begin each game with three lives.  These are represented by throwable flotation devices (Water Safety) or band aids (Helmet Safety) in the bottom righthand corner of the screen.  

If an unsafe Sprite exits the screen, the player loses a life.  Upon losing all three lives, the game immediately ends, and the player is taken to the game over/high score screen.

=== 

####Optimal Gameplay Environment: <a id="doc-c-d"></a>

We have found that the game renders best on very high resolution screens.  The game itself is more entertaining and gameplay is much more feasible on touch screen devices.  We recommend Chrome or Firefox as browsers on which to play the game.


===


Game Installation and Setup <a id="game-install"></a>
----

####Dependencies: <a id="req"></a>

* node.js/npm (nodejs.org) [included]
* browserify/npm [included]
* Phaser 2.3.0 (phaser.io) [included]

Note that all dependencies are bundled with the game.  No additional downloads are necessary to deploy this project.

===


####Running The Game<a id="run"></a>

Before running the game - make sure that the game is bundled using Browserify!  This can be done by navigating to the main directory of the game and executing the following command:

(cmd: browserify build/game.js -o bundle.js)

This applies changes from the individual JavaScript files for each game into bundle.js so that the game runs properly in a browser. This must be done before evaluating each change to the code - the bundle will not detect changes automatically and update.

===

#####Locally <a id="local"></a>

For running the game locally, use a disabled security session for Chrome, or run it using a local web server. Alternatively, Firefox seems to not have any security issues, so we recommend Firefox over chrome.

===
  
#####Remotely <a id="remote"></a>

Everything should work rather simply- there are no security issues to worry about. Just move the entirety of the folders to a remote location and it should work by pointing a browser at the index.html file in the main directory.

===

Contibutors <a id="authors"></a>
---

#####Spring 2015 <a id="s15"></a>

+ Jonathan Jefferson
+ Aaron Brown
+ Jared Beckham
+ Devin Beauchamp
+ Cassidy Helms

#####Fall 2015 <a id="f15"></a>

+ Zach Dvorak
+ Deven Desai
+ Kevin Aguilar


Extending This Project <a id="ext"></a>
---

Follow the instructions and formats above and retrofit the code per your need. Please fork this repository.




