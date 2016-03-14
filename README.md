
## Navigation

1. [Description](#sect1)
2. [Documentation](#doc)
  1. [Making Changes](#doc-a)
  2. [Design Decisions](#doc-b)
    1. [Spawning](#doc-b-a)
    2. [Scoring](#doc-b-b)
    3. [Lives](#doc-b-c)
    4. [Optimal Gameplay Environment](#doc-b-d)
2. [Game Installation](#game-install)
  1. [Prerequisites and Dependencies](#req)
  2. [Running the Game](#run)
    1. [Locally](#local)
    2. [Remotely](#remote)
3. [Contributors](#authors)
  1. [Spring 2015](#s15)
  2. [Fall 2015](#f15)
  3. [Spring 2016](#s16)
4. [Extending](#ext)

## Description <a id="sect1"></a>

A game created at the behest of UNC hospitals to encourage safe standards such as wearing a lifejacket every time you're on the water, or wearing a helmet every time you ride.

## Documentation<a id="doc"></a>

### Making Changes<a id="doc-a"></a>

To make changes to existing code, it is a fairly simple process: Edit the appropriate file listed below with the changes you'd like to make.

### Design Decisions <a id="doc-b"></a>

#### Spawning: <a id="doc-b-a"></a>

Sprites spawn from the left side of the screen at set time intervals.  It is helpful to think of an entity (a spawner) as the "creator" of Sprites that appear on the screen.  Initially (as soon as the game begins), there is one spawner creating Sprites at a rate of 1 Sprite every 3 seconds.  (Note that spawn times are predictable; not random within an interval).  After 20 seconds of gameplay, an additional spawner is added that creates a Sprite every 1.5 seconds.  This operates in tandem with the original spawner, meaning a total of 3 Sprites appear ever 3 seconds (1 from the first spawner and 2 from the second spawner).  After 20 more seconds, a third spawner is added that also generates a Sprite every 1.5 seconds.  Thus, for the remainder of the game, 5 Sprites spawn every 3 seconds.  

Sprites begin at a random location along the left side of the screen, and move in a randomly-generated bezier path to the right side of the screen.  The speed at which Sprites move increments by 1 unit every 5 seconds.  While the units of speed are arbitrary, the speed value must be a whole number.  We have found that incrementing by 1 unit every 5 seconds allows for a smooth, linear speed-up while ensuring that the game does not become overwhelming during the last few seconds.

Sprites and spawning behaves the same way for both the Helmet Safety and the Water Safety levels.

#### Scoring: <a id="doc-b-b"></a>

Players get points for clicking on unsafe Sprites or not clicking on already-safe Sprites.  The specific number of points awarded depends on the player's current score multiplier.  

Initially the multiplier is equal to 0.  When the user clicks on an unsafe Sprite or allows a safe Sprite to exit the screen, he/she receives points equal to 10 times the current multiplier value, and the multiplier increments by 1.  

Once the multiplier reaches 20, it is no longer incremented.  This is the maximum possible value of the score multiplier.

If the player clicks on an already-safe Sprite or allows an unsafe Sprite to exit the screen, the score multiplier resets to 1.  

#### Lives: <a id="doc-b-c"></a>

Players begin each game with three lives.  These are represented by throwable flotation devices (Water Safety) or band aids (Helmet Safety) in the bottom righthand corner of the screen.  

If an unsafe Sprite exits the screen, the player loses a life.  Upon losing all three lives, the game immediately ends, and the player is taken to the game over/high score screen.

#### Optimal Gameplay Environment: <a id="doc-b-d"></a>

We have found that the game renders best on very high resolution screens.  The game itself is more entertaining and gameplay is much more feasible on touch screen devices.  We recommend Chrome or Firefox as browsers on which to play the game.


## Game Installation and Setup <a id="game-install"></a>

### Dependencies: <a id="req"></a>

* Phaser 2.3.0 (phaser.io) [included]

Note that all dependencies are bundled with the game.  No additional downloads are necessary to deploy this project.

### Running the Game: <a id="run"></a>

#### Locally <a id="local"></a>

For running the game locally, use a disabled security session for Chrome, or run it using a local web server. Alternatively, Firefox seems to not have any security issues, so we recommend Firefox over chrome.

#### Remotely <a id="remote"></a>

Everything should work rather simply- there are no security issues to worry about. Just move the entirety of the folders to a remote location and it should work by pointing a browser at the index.html file in the main directory.

## Contibutors <a id="authors"></a>
---

### Spring 2015 <a id="s15"></a>

+ Jonathan Jefferson
+ Aaron Brown
+ Jared Beckham
+ Devin Beauchamp
+ Cassidy Helms

### Fall 2015 <a id="f15"></a>

+ Zach Dvorak
+ Deven Desai
+ Kevin Aguilar

### Spring 2016 <a id="s16"></a>

+ Ellen Shibley
+ Christina Harford
+ Joshua Potter

## Extending This Project <a id="ext"></a>

Follow the instructions and formats above and retrofit the code per your need. Please fork this repository.
