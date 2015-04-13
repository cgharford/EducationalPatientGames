
var http = require("http");
var port = process.argv[2];  //pass the port number as first argument in the command line
var server = http.createServer(function(request, response) {
    //POST - create
    //GET - read
    //PUT - update
    //DELETE - delete
    if (request.method === "POST") {
        //create a new record
    }
    if (request.method === "GET") {
        //read a record
    }
    if (request.method === "PUT") {
        //update existing record
    }
    if (request.method === "DELETE") {
        //delete a record
    }
    response.end("Hello");
});
server.listen(port);
console.log("Server ready");
