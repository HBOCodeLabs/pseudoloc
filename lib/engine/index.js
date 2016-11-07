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
var pseudo = require('./pseudo');
var google = require('./google');

function handleTokensAndTranslate (translationMethod, value, context, options) {
    // TODO: should these be specified in the options blob?
    var tokenPaterns = [
        /\$t\([\w\.]+\)/g,   // self reference function call: $t(ResBrand)
        /\{\{[\w\.]+\}\}/g,  // standard token patern: {{someToken}}
        /\}\(\w+\)/g,        // trailing part of markdown
    ];

    var replacements = {};
    var replacementIndex = Date.now();

    // replace all of the tokens and self references with placeholder values that
    // can survive the character mangling.  eg "$t(ResBrand)" becomes ([234991223]).
    // start at a resonably high offset just in case our loc strings legitimately
    // contain strings like "[0]"
    tokenPaterns.forEach(function (re) {
        value = value.replace(re, function(match) {
            var key = '$$' + replacementIndex + '$$';
            replacementIndex++;
            replacements[key] = match;
            return key;
        });
    });

    // perform translation.  Pass in the key context in case the translation method needs it.
    // this is (or can be) an asynchronous request
    return translationMethod(value, context, options)
        .then(function (translatedValue) {
            // replace our placeholder values with their original token values which
            // have not been translated.
            return translatedValue.replace(/\$\$\d+\$\$/g, function(match) {
                return replacements[match];
            });
        });
}

function translate(value, context, options) {
    switch(options.method) {
        case 'google':
            return handleTokensAndTranslate(google, value, context, options);
        default:
            return handleTokensAndTranslate(pseudo, value, context, options);
    }
}

module.exports = {
    translate: translate,
    methods: {
        google: google,
        pseudo: pseudo
    }
}
