<<<<<<< HEAD


//describe is a suite
//it("test", function() {}) is a test
//expect is the jasmine equivalent of assert

"use strict";

describe("Hello World", function() {
    it("says hello", function() {
        expect(helloWorld()).toEqual("Hello World!");
    });
    it("is not null", function() {
        expect(helloWorld()).not.toEqual(null);
    })
=======
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
>>>>>>> 9e85ef859367ad2d4ef28bf9e4beff20f5c2d4c4
});
server.listen(port);
console.log("Server ready");
