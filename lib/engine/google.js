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

// google has a translation limit of 100,000 characters per 100 seconds (average 1000 characters/second)
// throttle us to 3 requests per second to keep us under that limit (our longest strings are about 350 characters)
// TODO: presecan or use running average to keep us under that threshold

throttledRequest.configure({
    requests: 3,
    milliseconds: 1000
});

var apiUrlFunc = _.template('https://www.googleapis.com/language/translate/v2?key=<%= apiKey %>&q=<%= value %>&source=en&target=<%= languageKey %>&format=html');

function googleTranslate (value, context, options) {
    return new Promise(function (resolve, reject) {
        var url = apiUrlFunc({
            // swap out line breaks for html <br/> tags so they're preserved through the translation process.
            value: encodeURI(value.replace(/\n/g, '<br/>')),
            apiKey: options.apiKey,
            languageKey: options.targetLanguage
        });

        throttledRequest(
            {
                method: 'GET',
                uri: url,
                json: true
            },
            function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    var translatedText = _.get(body, ['data', 'translations', 0, 'translatedText'], '');
                    // swap line breaks back in for their original value.  Translation seems to pad new lines with extra space around them
                    // that wasn't there before, so trim spaces on either side of the newlines.
                    translatedText = translatedText.replace(/\s*\<br\/\>\s*/g, '\n');
                    resolve(translatedText);
                }
            }
        );
    });
}

module.exports = googleTranslate;
