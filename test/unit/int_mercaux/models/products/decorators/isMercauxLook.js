/* eslint-disable no-undef */
'use strict';

var assert = require('chai').assert;

describe('product is isMercauxLook decorator', function () {
    var isMercauxLook = require('../../../../../../cartridges/int_mercaux/cartridge/models/product/decorators/isMercauxLook');

    var apiProductMock = {
        custom: { isMercauxLook: true }
    };

    var apiProductMock2 = {
        custom: { isMercauxLook: false }
    };

    it('should return true property for passed in object', function () {
        var object = {};
        isMercauxLook(object, apiProductMock);
        assert.equal(object.isMercauxLook, true);
    });

    it('should return false property for passed in object', function () {
        var object = {};
        isMercauxLook(object, apiProductMock2);
        assert.equal(object.isMercauxLook, false);
    });
});

