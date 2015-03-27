

//describe is a suite
//it("test", function() {}) is a test
//expect is the jasmine equivalent of assert

describe("a suite", function() {
    //this is where the tests go
    "use strict";

    it("a is in fact 'Hello World' and be is not null", function() {
        var a = "Hello World";
        var b = true;
        expect(a).toBe("Hello World");
        expect(b).not.toBe(null);
    })
});

