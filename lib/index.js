/**
 * @preserve Copyright (c) 2015 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */

'use strict';

var Promise = require('bluebird');
var handlers = require('./handlers');

function validateThenTranslate (fileTypeHandler, data, options) {
    if (!options) {
        return Promise.rejected('you must specify an options object');
    }
    switch(options.method) {
        case 'google':
            if (!options.apiKey) {
                return Promise.rejected('you must specify a google translate API key to use google translate');
            }
            if (!options.targetLanguage) {
                return Promise.rejected('you must specify a target language to use google translate');
            }
    }

    return fileTypeHandler(data, options);
}

module.exports = {
    json: validateThenTranslate.bind(undefined, handlers.json),
    po: validateThenTranslate.bind(undefined, handlers.po),
}
