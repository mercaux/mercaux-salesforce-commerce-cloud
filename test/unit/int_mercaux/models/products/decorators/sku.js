/* eslint-disable no-undef */
'use strict';

var assert = require('chai').assert;

describe('product is sku decorator', function () {
    var sku = require('../../../../../../cartridges/int_mercaux/cartridge/models/product/decorators/sku');

    var apiProductMock = {
        manufacturerSKU: '1122 Green'
    };

    it('should be equal with expected value for passed in object', function () {
        var object = {};
        sku(object, apiProductMock);
        assert.equal(object.sku, '1122 Green');
    });
});
