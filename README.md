
## Navigation

1. [Description](#sect1)
2. [Documentation](#doc)
  1. [Making Changes](#doc-a)
  2. [Optimal Gameplay Environment](#doc-b)
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

A library of games designed and programmed for the UNC hospital system, targeted to engage and educate preschool aged children. Current games address lifejackets, helmets, and burn safety.

## Documentation<a id="doc"></a>

### Making Changes<a id="doc-a"></a>

Regarding changes to one of the games, all of the files are easily editable. The main game in each folder is dependent on the assests inside their subfolders. These dependencies should be obvious to a mildly experienced programmer. However, if you are unsure, we reccomend you check the headers of each HTML file to ensure you aren't removing any dependencies.

To add a new game link to the main site, open the index.html file on the system's root level, and find the <div class="content-container row"> section. Each game is formatted inside as follows...

            <div class="col-lg-4 col-md-6 col-sm-6 gameContainer">
                <div class="gameTitle">
                    YOUR TITLE
                </div>
                <div>
                    <a href="games/YOUR_GAME_FOLDER/YOUR_GAME.html">
                        <img class="gameImg" src="games/YOUR_GAME_FOLDER/assets/imgs/YOUR_GAME_THUMBNAIL.png">
                    </a>
                </div>
                <div class="gameExplanation">
                    YOUR EXPLANATION
                </div>
            </div>

Simply copy this into the specified section and fill in the emphasized sections with your own information. Note that this will obviously require the existance of the .html and .png files you will name in this section.

To add new game code to the library, navigate to the games folder and create a folder for your game. Note that the only file that is strictly neccesary for the purposes of the 'new game link' specifications above is a .html folder for your game. However, your game will likely require other files. We reccomend you check our vendor folder on the root level for any dependencies such as bootstrap or phaser, which are already packaged in our program. Beyond that, we also highly reccomend you follow the organizational format of the other games in this library, which you may explore yourself.

Modifying the library's database is permitable only by the request of the UNC hospital system. For those with that access, the basic database load and save functions are in the db-api file. Note that you should only need to make basic modifications to this file, to accomodate the new input you've created.


### Optimal Gameplay Environment: <a id="doc-b"></a>

For the water safety and bicycle safety games, previous groups have found that the game renders best on very high resolution screens.  The game itself is more entertaining and gameplay is much more feasible on touch screen devices.  They recommend Chrome or Firefox as browsers on which to play the game.

The additions made with the puzzle game should allow for an improved mobile experience. However, we still recommend tablets as the optimal (and our client's intended) medium.


## Game Installation and Setup <a id="game-install"></a>

### Dependencies: <a id="req"></a>

* Phaser 2.3.0 (phaser.io)
* Bootstrap
* Jquery
* Paper

Note that all dependencies are bundled with the game inside the 'vendor' folder.  No additional downloads are necessary to deploy this project.

### Running the Game: <a id="run"></a>

Note that running the game on a personal computer will prevent the game from accessing the high scores database. Additionally, depending on the security settings of your chosen browser, said browser may prevent your files from interacting as they were intended. For a full, easy experience, we recommend our client's main site.

There are no neccesary hardware installations or user name/password pairs. The newest 'burn' game has been tested on computer, tablet, and mobile. It works best on computer and tablet, as already mentioned. Unfortunately, the preceding projects left little detail on their own functionality limitations, and at the time of this writing, the current group has not done extensive testing on past projects to assess their functionality. That aside, here are our recommendations for usage.

#### Locally <a id="local"></a>

For running the game locally, previous groups have recommended using a disabled security session for Chrome, or a local web server. Alternatively, past groups have also reccomended Firefox.

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
