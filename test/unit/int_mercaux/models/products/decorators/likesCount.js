/* eslint-disable no-undef */
'use strict';

var assert = require('chai').assert;

describe('product is likesCount decorator', function () {
    var likesCount = require('../../../../../../cartridges/int_mercaux/cartridge/models/product/decorators/likesCount');

    var apiProductMock = {
        custom: { likesCount: 10 }
    };

    it('should return 10 value property for passed in object', function () {
        var object = {};
        likesCount(object, apiProductMock);
        assert.equal(object.likesCount, 10);
    });
});

