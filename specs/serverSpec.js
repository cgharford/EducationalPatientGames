

//describe is a suite
//it("test", function() {}) is a test
//expect is the jasmine equivalent of assert

"use strict";
var HOSTNAME = "bluefish.cs.unc.edu";
var SERVERLISTENPORT = "3130";

describe("Hello World", function() {
    it("says hello", function() {
        expect(helloWorld()).toEqual("Hello World!");
    });
    it("is not null", function() {
        expect(helloWorld()).not.toEqual(null);
    })
});
//to test the server need to run server in background and then simulate requests in the testing suite
describe("Server", function() {
    var request = require('request');
    var serverAddr = HOSTNAME + ":" + SERVERLISTENPORT;
    it("says hello", function(done) {
        request(serverAddr, function(error, response, body) {
            expect(body).toEqual("Hello");
            done();
        })
    })

});


