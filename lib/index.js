var Promise = require('bluebird');

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
    json: validateThenTranslate.bind(undefined, require('./translateJson')),
    po: validateThenTranslate.bind(undefined, require('./translatePo')),
}
