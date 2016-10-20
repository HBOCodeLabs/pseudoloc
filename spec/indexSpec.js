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
var proxyquire = require('proxyquire');
var handlers = require('../lib/handlers');
var lib = require('../lib');

describe('validation', function () {
    var lib;
    var handlers;
    beforeEach(function () {
        handlers = {
            json: jasmine.createSpy('json').and.returnValue(Promise.fulfilled()),
            po: jasmine.createSpy('po').and.returnValue(Promise.fulfilled())
        }
        lib = proxyquire('../lib', { './handlers': handlers });
    });

    afterEach(function () {
        lib = undefined;
    });

    [
        'json',
        'po'
    ].forEach(function (method) {
        it('rejects if no options parameter has been provided (' + method + ')', function (done) {
            lib[method]('', undefined).catch(function (err) {
                expect(err).toBeDefined();
                done();
            });
        });

        it('requires no on options - assumes pseudo localization (' + method + ')', function (done) {
            var data = ''; // doesn't matter
            var options = {};
            lib[method](data, options).then(function () {
                expect(handlers[method]).toHaveBeenCalledWith(data, options);
                done();
            });
        });

        it('requires an apiKey for google translation (' + method + ')', function (done) {
            var options = {
                method: 'google'
            };
            lib[method]('', options).catch(function (err) {
                expect(err).toBeDefined();
                done();
            });
        });

        it('requires a targetLanguage for google translation (' + method + ')', function (done) {
            var options = {
                method: 'google',
                apiKey: 'apiKey'
            };
            lib[method]('', options).catch(function (err) {
                expect(err).toBeDefined();
                done();
            });
        });

        it('calls through as expected if provided all google paramters (' + method + ')', function (done) {
            var data = ''; // doesn't matter
            var options = {
                method: 'google',
                apiKey: 'apiKey',
                targetLanguage: 'es'
            };
            lib[method]('', options).then(function () {
                expect(handlers[method]).toHaveBeenCalledWith(data, options);
                done();
            });
        });
    });
});
