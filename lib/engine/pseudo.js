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
var tables = require('./pseudoTables');
var seedrandom = require('seedrandom');

function performPseudoLoc(value, context, options) {
    // Use context as a seed for the pseudo random number generator so that the
    // same string will always be mangled in the same way but that identical
    // strings will be mangled differently. This ensures we don't have a million
    // screen shot differences each time we run pseudo loc
    var myrng = new Math.seedrandom(context);
    var characterTable = options.asian === true ? tables.asian : tables.latin;
    // try and replace every regex "word" character.
    return value.replace(/\w/g, function(match) {
        var row = characterTable[match];
        // we might not have a character replacement for every character
        if (row) {
            // select a (predictable) random index of the available replacement options
            var idx = Math.floor(myrng() * row.length);
            return row[idx];
        } else {
            // no mapping for this character, just return the original character
            return match;
        }
    });
}

module.exports = function(value, context, options) {
    return Promise.fulfilled(performPseudoLoc(value, context, options));
};
