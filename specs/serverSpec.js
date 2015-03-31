

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
});

describe("Server Responds", function() {
    var request = require('request');
    var myServ = new Server(10080);
    it("says hello", function(done) {
        request("http://localhost:10080", function(error, response, body) {
            expect(body).toEqual("Hello");
            done();
        })
    })
});


