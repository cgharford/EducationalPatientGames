//javascript to test browserify

var getReq = require("./game1/getFromServer.js");
var postReq = require("./game1/postToServer.js");

var object = getReq();
//postReq("john", 200);


console.log (object);

/* for (i = 0; i < object.length; i++) {
    console.log("name: " + object[i].username + ", score: " + object[i].score);
}; */