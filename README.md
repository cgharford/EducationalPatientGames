# Game Installation and Setup

Requirements:
  node.js/npm (nodejs.org)
  Phaser (phaser.io) [included]
  MongoDB (docs.mongodb.org/manual/installation)
  
Installation:
To run the client-side game alone:

clone the repository and open index.html in a browser.


To run the game with optional server:

Place the files package.json and ./build/nodeServer onto a machine, navigate to the directory in which they are stored and run "npm install" to install necessary node dependencies.  The server also requires mongoDB to be running on localhost.  Then run .build/nodeServer [portNumber] to start the server listening on given port of the machine.  

Open .build/game1/getFromServer.js and .build/game1/postToServer.js and change the HOST and PORT constants to the appropriate hostname and port number of the machine on which the server is running.  Then rebundle the project using browserify ("npm install -g browserify" then "browserify build/game.js > bundle.js").  

Start a browser session without web security ("chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security" for Chrome on Windows) and open index.html in that session.  
The server program will log records inserted into or retrieved from the database to the terminal of the machine it is running on.
