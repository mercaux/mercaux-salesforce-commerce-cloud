/* eslint-disable no-undef */

'use strict';

var assert = require('chai').assert;

describe('product is lookType decorator', function () {
    var lookType = require('../../../../../../cartridges/int_mercaux/cartridge/models/product/decorators/lookType');

    var apiProductMock = {
        custom: { lookType: { value: 'summer' } }
    };

    it('should return summer value property for passed in object', function () {
        var object = {};
        lookType(object, apiProductMock);
        assert.equal(object.lookType, 'summer');
    });
});

