'use strict';

var collections = require('*/cartridge/scripts/util/collections');

/**
 * @constructor
 * @classdesc Returns images for a given product
 * @param {dw.catalog.Product} product - product to return images for
 * @param {Object} imageConfig - configuration object with slide image
 */
function Images(product, imageConfig) {
    var origImages = product.getImages(imageConfig.fromType);
    var result = [];
    if (origImages.length < 0) {
        return result;
    }

    result = collections.map(origImages, function (image, index) {
        var width = imageConfig.w || null;
        var height = imageConfig.h || null;
        var origAbsURL = image.absURL.toString();

        if (width || height) {
            var newConfig = {};

            if (width) newConfig.scaleWidth = width;
            if (height) newConfig.scaleHeight = height;

            origAbsURL = image.getAbsImageURL(newConfig);
        }

        return {
            alt: image.alt,
            url: image.URL.toString(),
            index: index.toString(),
            title: image.title,
            absURL: origAbsURL
        };
    });

    return result[0];
}

module.exports = Images;
