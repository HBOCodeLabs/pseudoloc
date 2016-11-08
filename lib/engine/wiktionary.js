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
var _ = require('lodash');
var request = require('request');
var throttledRequest = require('throttled-request')(request);

// we want to play nicely with wiktionary, so keep us under 10 rps
throttledRequest.configure({
    requests: 10,
    milliseconds: 1000
});

var internals = {
    translationHistory: {}
};

internals.makeWikiRequest = function (word, language) {
    // grab the wikipedia markdown.  It's MUCH easier to parse than anything else and the services respond quickly
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'GET',
            uri: 'https://en.wiktionary.org/w/index.php?action=raw&title=' + encodeURIComponent(word)
        };
        throttledRequest(options, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }
            // grab the first string match (t+).  weak matches only considered if there are no strong matches.
            var reStrongMatch = new RegExp("\\{\\{t\\+\\|" + language + "\\|([\\w\\s]+)\}", "i");
            var reWeakMatch = new RegExp("\\{\\{t\\|" + language + "\\|([\\w\\s]+)\}", "i");
            var match = reStrongMatch.exec(body);
            if (match) {
                resolve(match[1]);
            } else {
                match = reWeakMatch.exec(body);
                if (match) {
                    resolve(match[1]);
                } else {
                    reject("no translation found");
                }
            }
        });
    });
}

internals.getSingleWord = function (word, language) {
    return new Promise(function (resolve) {
        word = word.toLowerCase();
        if (internals.translationHistory[word] === undefined) {
            // first time we've ever tried to translate this word into any language
            internals.translationHistory[word] = {};
        }
        // check if we've already translated it (no need to hammer for repeat requests)
        if (internals.translationHistory[word][language] !== undefined) {
            resolve(internals.translationHistory[word][language]);
            return;
        }

        // need to fetch the word from wiktionary.  on result, store it so we can short circuit future attempts
        function finalize(t) {
            internals.translationHistory[word][language] = t;
            resolve(t);
        }

        internals.makeWikiRequest(word, language).then(function (t) {
            finalize(t);
        }).catch(function () {
            // don't actually care about the result, just the fact that we're never going to be able to
            // translate this word.  Just return the original word for all future translations
            finalize(word);
        })
    });
};

internals.createTranslationPromise = function (word, language, strings, index) {
    return internals.getSingleWord(word, language).then(function(t) {
        if (word[0] === word[0].toUpperCase()) {
            // word was capitalized, it won't have been in translation so revert its casing
            t = _.capitalize(t);
        }
        strings[index] = t;
    });
};

function wikiTranslate (value, context, options) {
    // break out each of the individual words in the string and translate them, then replace them
    // we only care about consecutive alpha characters (regardless of case).  Ignore all others
    var promises = [];
    var strings = [];
    var reTranslatableWordMatch = /([a-z]+)/gi;
    var lastIndex = 0;
    var match;
    while ((match = reTranslatableWordMatch.exec(value)) !== null) {
        if (lastIndex < match.index) {
            // a non-word string exists before this match and after any previous matches
            // make sure to keep hold of it.
            strings.push(value.substring(lastIndex, match.index));
        }
        // store the word as is, but also reate a promise to translate it and store that promise;
        strings.push(match[1]);
        promises.push(internals.createTranslationPromise(match[1], options.targetLanguage, strings, strings.length - 1));
        lastIndex = match.index + match[0].length;
    }
    // make sure to include anything after the last matching word block
    if (lastIndex < value.length) {
        strings.push(value.substring(lastIndex, value.length));
    }

    // now resolve all of the translation promises
    return Promise.all(promises).then(function() {
        // all of strings has been translated in place, just return the joined array
        return strings.join('');
    });
};

module.exports = wikiTranslate;
