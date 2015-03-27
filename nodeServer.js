
var http = require("http");
var server = http.createServer(function (request, response) {
    response.end("Server respone to any request");
});
server.listen(10080); //arbitrary port number
console.log("Server ready");