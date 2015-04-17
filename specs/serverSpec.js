

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
