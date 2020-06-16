'use strict';

var ImageModel = require('*/cartridge/models/product/croppedImagesModel');

module.exports = function (object, product, config) {
    Object.defineProperty(object, 'croppedImage', {
        enumerable: true,
        value: new ImageModel(product, config)
    });
};
