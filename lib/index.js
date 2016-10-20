var Promise = require('bluebird');
var handlers = require('./handlers');

function validateThenTranslate (fileTypeHandler, data, options) {
    if (!options) {
        return Promise.rejected("you must specify an options object");
    }
    switch(options.method) {
        case "google":
            if (!options.apiKey) {
                return Promise.rejected("you must specify a google translate API key to use google translate");
            }
            if (!options.targetLanguage) {
                return Promise.rejected("you must specify a target language to use google translate");
            }
    }

    return fileTypeHandler(data, options);
}

module.exports = {
    json: function(data, options) { return validateThenTranslate(handlers.json, data, options); },
    po:   function(data, options) { return validateThenTranslate(handlers.po, data, options); },
}
