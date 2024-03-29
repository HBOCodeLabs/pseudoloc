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
var engine = require('../engine');
var _ = require('lodash');
var gettextParser = require('gettext-parser');

function createTranslationPromise (translations, contextName, messageName, msgRecord, options) {
    // may need to translate plural forms, so work in arrays
    var promises = [];
    msgRecord.msgstr = [];

    promises.push(engine.translate(msgRecord.msgid, 'root.' + contextName + '.' + messageName, options)
            .then(function(translatedValue) {
                indicateProgress(true);
                translations[contextName][messageName].msgstr[0] = translatedValue;
            })
            .catch(function(error){
                indicateProgress(false);
                translations[contextName][messageName].msgstr[0] = 'ERROR TRANSLATING: ' + error;
            }));

    // TODO: this assumes that the input po file is in a nplurals=2 locale, is that always valid?
    if (msgRecord.msgid_plural) {
        promises.push(engine.translate(msgRecord.msgid_plural, contextName + '.' + messageName + '_plural', options)
                .then(function(translatedValue) {
                    indicateProgress(true);
                    translations[contextName][messageName].msgstr[1] = translatedValue;
                })
                .catch(function(error){
                    indicateProgress(false);
                    translations[contextName][messageName].msgstr[1] = 'ERROR TRANSLATING: ' + error;
                }));
    }

    return Promise.all(promises);
}

function indicateProgress (success) {
    if (success) {
        process.stdout.write('\u2713');
    } else {
        process.stdout.write('\u26A0');
    }
}

function handleFile(input, options) {
    options = options || {};
    var obj = gettextParser.po.parse(input);
    obj.charset = 'utf-8';
    // setting charset should have set the content-type header as well, but in practice it doesn't.  set it manually
    obj.headers['content-type'] = 'text/plain; charset=utf-8';
    var promises = [];
    _.forOwn(obj.translations, function(context, contextName) {
        _.forOwn(context, function(msgRecord, messageName) {
            promises.push(createTranslationPromise(obj.translations, contextName, messageName, msgRecord, options))
        });
    });
    return Promise.all(promises)
        .then(function(){
            return gettextParser.po.compile(obj);
        })
        .finally(function () {
            // finalize progress indicators
            process.stdout.write('\n');
        });
}

module.exports = {
    handle: handleFile
};
