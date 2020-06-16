/* eslint-disable no-undef */

'use strict';
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var assert = require('chai').assert;

describe('product is croppedImage decorator', function () {
    var ImageModelMock = {
        alt: 'image alt',
        url: 'image url',
        index: '1',
        title: 'image title',
        absURL: 'image ABS url'
    };

    var croppedImage = proxyquire('../../../../../../cartridges/int_mercaux/cartridge/models/product/decorators/croppedImage', {
        '*/cartridge/models/product/croppedImagesModel': function () { return ImageModelMock; }
    });

    var expectedResult = {
        alt: 'image alt',
        url: 'image url',
        index: '1',
        title: 'image title',
        absURL: 'image ABS url'
    };


    var apiProductMock = {
        custom: { croppedImage: ImageModelMock }
    };

    it('should be equal with expected object of croppedImage custom field in object', function () {
        var object = {};
        croppedImage(object, apiProductMock);
        assert.deepEqual(object.croppedImage, expectedResult);
    });

    it('should be not equal value of custom field in object', function () {
        var object = {};
        croppedImage(object, apiProductMock);
        assert.notEqual(object.croppedImage.alt, 'not expected');
    });
});

