

var http = require("http");
var port = process.argv[2];  //pass the port number as first argument in the command line
var server = http.createServer(function(request, response) {
    response.end("Hello");
    });
server.listen(port);
console.log("Server ready");



