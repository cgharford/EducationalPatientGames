

//describe is a suite
//it("test", function() {}) is a test
//expect is the jasmine equivalent of assert

describe("Hello World", function() {
    it("says hello", function() {
        expect(helloWorld()).toEqual("Hello World!");
    });
    it("is not null", function() {
        expect(helloWorld()).not.toEqual(null);
    })
});


