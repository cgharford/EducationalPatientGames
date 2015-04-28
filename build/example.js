//javascript to test browserify

var getReq = require("./getFromServer.js");
var postReq = require("./postToServer.js");

getReq();
postReq("john", 200);