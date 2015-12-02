
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

A game created at the behest of UNC hospitals to encourage safe standards such as wearing a lifejacket every time your on the water, or wearing a helmet every time you ride.

Documentation<a id="doc"></a>
----

####Making Changes<a id="doc-a"></a>

To make changes to existing code, it is a fairly simple process: Edit the appropriate file listed below with to make the changes.

####The Code Itself<a id="doc-b"></a>

The code is fairly due to the nature of phaser's code. Below is a description of the way the code is organized and how to properly make additions or changes to the game within the code.

#####Menu <a id="doc-b-a"></a>

Menus - The Game menus and everything that is common to all games, including those that should be added later.

===

#####Game.js<a id="doc-b-a-a"></a>

Game.js is the very first file that is created. It defines the states that are added to the game, as well as defining the game as a javascript variable (which the entire game is defined as) in addition to defining a proper aspect ratio. All globals that need to be added to the game should be added here as well.

===

#####Boot.js<a id="doc-b-a-b"></a>


Boot.js is the file that is loaded before all other files. It defines various common properies to all games. Examples of common properties are the cookies used to store the high scores, the overall scale of the game. This file has 4 main methods.

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
    create is called last as defined by phaser's documentation of the two methods. 
    Currently this method is just used to properly start the game by moving it to the
    next state, 'Wrapper' (wrapper.js)
  */
}

function enterIncorrectOrientation(){
  /*
    This method just defines a style that should be applied 
    should the device be rotated to an incorrect state
  */
}

function leaveIncorrectOrientation(){
  /*
    This method just defines a style that should be applied 
    should the device be rotated from an incorrect state to a correct state
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
    like gravity, or spawning
  */
}

function create(){
  /*
    This is what creates the game area, or the menu itself
    It has three sections in which a block is created that is the button to click
    to move the the game which swaps states to the game selected
  */
}

```

===

###Games <a id="doc-b-b"></a>

Each game should be defined as four files - located under build/ the four files emulate phaser's own style.

The first file, preload, should define all assets for the game, and then move to the title state

The second file, title, should create a splash scren that when the user presses 'play' it advances to the game proper

The third file, game, should define everything about the game. This is the actualy game. After the victory or loss condition is achieved, the next state should be victory

The fourth file, victory, defines the high score screen and deal with moving the scores to a high scores server or cookie and display at least the two high score. After this state, it should be moved to wrapper so that the user has an option to move to a different game.

===

####Preload.js <a id="doc-b-b-a"></a>

preload.js should have only one method (with optional helper methods) - preload which loads the assets to be used in the game. It should automatically advance the game without any human input to the next state

```javascript

function preload() {
  /*
    Asset loading goes here
  */
}

```

===

####Title.js <a id="doc-b-b-b"></a>

title.js should have only one method, (with optional helper methods) - create, which creates the entirety of the title splash screen. It should have some way to transition to the next state

```javacript
function create(){
  /*
    Stuff that needs to be created to create the title screen, such as a screen background goes here
  */
}
```

===

####Game.js <a id="doc-b-b-c"></a>

Game.js Defines everything about the game - mechanics, lives, utilizing assets, etc. It uses phaser's three method definition of a game. The three methods are preload, create, and update.

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

Victory defines a static screen for high scores and the display of the users score. It should have one method, and optional helper methods.

```javascript
  
function create() {
  /*
    This function defines the look and functionality of the static screen. It is called only once.
  */
}
  
```

===

Game Installation and Setup <a id="game-install"></a>
----

####Dependencies: <a id="req"></a>

* node.js/npm (nodejs.org)
* browserify/npm
* Phaser 2.3.0 (phaser.io) [included]

===


####Running The Game<a id="run"></a>

Before running the game - make sure that the game is bundled through Browserify 

(cmd: browserify build/game.js -o bundle.js)

To apply the changes to bundle.js to run the game proper. This must be done before evaluating each change to the code -
the bundle will not detect changes automatically and update.

===

#####Locally <a id="local"></a>

For running the game locally -run it in a disabled security session for chrome, as there a security issues for running it locally. Alternatively, firefox seems to not have this problem, so for local uses firefox is reccommended over chrome.

===
  
#####Remotely <a id="remote"></a>

Everything should work rather simply- there are no security issues to worry about. Just move the entirety of the folders to a remote location and it shuld work out.

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




