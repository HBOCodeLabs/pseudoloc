
var Promise = require('bluebird');
var handlers = require('../lib/handlers');
var lib = require('../lib');

describe("main entry point", function () {
    it("validates input before handing off to actual handlers", function (done) {
        spyOn(handlers, "json").and.returnValue(Promise.fulfilled());
        spyOn(handlers, "po").and.returnValue(Promise.fulfilled());

        var data = ""; // doesn't matter
        var options = {};
        lib.json(data, {}).then(function() {
            expect(handlers.json).toHaveBeenCalledWith(data, options);
            done();
        });
    });
});
