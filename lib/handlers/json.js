var Promise = require('bluebird');
var engine = require('../engine');
var _ = require('lodash');

function createRecursePromise (target, options, context, propertyName) {
    return translateTarget(target[propertyName], options, context + "." + propertyName)
                .then(function(translatedTarget) {
                    indicateProgress(true);
                    target[propertyName] = translatedTarget;
                }).catch(function(error) {
                    indicateProgress(false);
                    // TODO, should this re-throw so we get a catch statement later?
                    target[propertyName] = "ERROR TRANSLATING: " + error;
                });
}

function translateTarget(target, options, context) {
    if (typeof target === 'string') {
        return engine.translate(target, context, options);
    } else {
        var promises = [];
        for (var prop in target) {
            // recurse.  Have to use a creator function so that we property capture the property name variable
            var promise = createRecursePromise(target, options, context, prop);
            promises.push(promise);
        };
        return Promise.all(promises).then(function (results) {
            return target;
        });
    };
}

function indicateProgress (success) {
    if (success) {
        process.stdout.write('\u2713');
    } else {
        process.stdout.write('\u26A0');
    }
}

function handleFile(target, options) {
    options = options || {};
    // clone the object so we perserve key order but don't destroy the initial object
    return translateTarget(_.cloneDeep(target), options, 'root')
        .finally(function () {
            // finalize progress indicators
            process.stdout.write('\n');
        });
}

module.exports = {
    handle: handleFile
};
