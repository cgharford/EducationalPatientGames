


var http = require("http");
var qs = require("querystring");
var port = process.argv[2];  //pass the port number as first argument in the command line
var server = http.createServer(function(request, response) {
    //POST - create
    //GET - read
    //PUT - update
    //DELETE - delete
    var body = '';
    if (request.method === "POST") {
        //create a new record
        request.on('data', function(data) {
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', function() {
            var obj = JSON.parse(body);
            console.log(obj.username);
            console.log(obj.score);
        })
    }
    if (request.method === "GET") {
        //read a record
        request.on('data', function(data) {
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', function() {
            var post = qs.parse(body);
            console.log(post);
        })
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