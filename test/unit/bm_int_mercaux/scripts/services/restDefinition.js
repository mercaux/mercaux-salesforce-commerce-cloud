/* eslint-disable no-undef */
'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('Service definition', function () {
    var restDefinition = proxyquire('../../../../../cartridges/bm_mercaux/cartridge/scripts/services/restDefinition', {
        'dw/util/StringUtils': {
            format: function () {
                return 'formatted string';
            }
        },
        'dw/system/Logger': {
            error: function (text) {
                return text;
            }
        }
    });


    it('should return object with definitions of routes', function () {
        var restDef = restDefinition.endpoints;
        var expectedDef = {
            get: {
                looks: 'look'
            }
        };
        assert.deepEqual(restDef, expectedDef);
    });

    it('should create a service definition', function () {
        var fetchAllLooksService = restDefinition.service.fetchAllLooks();

        assert.isFunction(fetchAllLooksService.createRequest, 'createRequest service definitions');
        assert.isFunction(fetchAllLooksService.parseResponse, 'parseResponse service definitions');
        assert.isFunction(fetchAllLooksService.mockCall, 'mockCall service definitions');
    });
});
