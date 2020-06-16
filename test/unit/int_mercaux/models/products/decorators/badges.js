/* eslint-disable no-undef */
'use strict';

var assert = require('chai').assert;

describe('product is badges decorator', function () {
    var badges = require('../../../../../../cartridges/int_mercaux/cartridge/models/product/decorators/badges');

    var apiProductMock = {
        custom: { badges: 'some badge' }
    };

    it('should return some badge property for passed in object', function () {
        var object = {};
        badges(object, apiProductMock);
        assert.equal(object.badges, 'some badge');
    });
});
