/* eslint-disable no-undef */
'use strict';

var assert = require('chai').assert;

describe('Service helpers', function () {
    var serviceHelpers = require('../../../../../cartridges/bm_mercaux/cartridge/scripts/services/helpers');

    var mockJSONClient = {
        getResponseHeader: function () {
            return 'application/json; charset=utf-8';
        }
    };

    var mockNonJSONClient = {
        getResponseHeader: function () {
            return 'text/html; charset=utf-8';
        }
    };

    it('Should return true when response JSON', function () {
        assert.equal(serviceHelpers.isResponseJSON(mockJSONClient), true);
    });

    it('Should return false when response is not JSON', function () {
        assert.equal(serviceHelpers.isResponseJSON(mockNonJSONClient), false);
    });

    it('Should generate mock response and add methods', function () {
        var rawMock = {
            status: 'OK',
            statusCode: 200,
            msg: '',
            statusMsg: '',
            errorText: '',
            text: { foo: 'bar' },
            isMockResult: true
        };

        var getMockResponse = serviceHelpers.generateMockResponse(rawMock);

        var expectedMock = {
            status: getMockResponse.getStatus(),
            statusCode: getMockResponse.getStatusCode(),
            msg: getMockResponse.getMsg(),
            statusMsg: getMockResponse.getStatusMessage(),
            isMockResult: getMockResponse.isMockResult(),
            errorText: getMockResponse.errorText,
            text: getMockResponse.text
        };

        assert.deepEqual(rawMock, expectedMock);
    });
});
