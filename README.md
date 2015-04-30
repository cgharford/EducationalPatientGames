# Game Installation and Setup

Requirements:
  node.js/npm (nodejs.org)
  Phaser (phaser.io) [included]
  MongoDB (docs.mongodb.org/manual/installation)
  
Installation:
Navigate to the project directory and run “npm install” to install necessary node dependencies.  Run ./build/nodeServer.js [portNumber] to start the server on provided port.  In the files ./build/getFromServer.js and ./build/postToServer.js change the HOST and PORT constants to the appropriate values for the machine running the server, and then rebundle the game using browserify (browserify build/game.js > bundle.js).  Now you can host the client, preferably on same system as the server to avoid issues from the same-origin policy (or host the client without the server).   
