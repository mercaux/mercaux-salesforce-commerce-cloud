/* eslint-disable no-undef */
'use strict';

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var assert = require('chai').assert;

describe('product is slideImage decorator', function () {
    var ImageModelMock = {
        alt: 'image alt',
        url: 'image url',
        index: '1',
        title: 'image title',
        absURL: 'image ABS url'
    };

    var slideImage = proxyquire('../../../../../../cartridges/int_mercaux/cartridge/models/product/decorators/slideImage', {
        '*/cartridge/models/product/croppedImagesModel': function () { return ImageModelMock; }
    });

    var expectedResult = {
        alt: 'image alt',
        url: 'image url',
        index: '1',
        title: 'image title',
        absURL: 'image ABS url'
    };

    it('should be equal with expected object of croppedImage custom field in object', function () {
        var object = {};
        slideImage(object, {}, {});
        assert.deepEqual(object.slideImage, expectedResult);
    });
});
