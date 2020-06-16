/* eslint-disable no-mixed-operators */
'use strict';

let collections = require('*/cartridge/scripts/util/collections');
var Logger = require('dw/system/Logger');

/**
 * Generates arrays of random selected IDs with limit length
 * @param {Array<string>} productIDs - Array with productID
 * @param {number} numberOfProducts -  Size of result array
 * @returns {Array<string>} - Result array with the random productIDs and length based on numberOfProducts
 */
function generateRandomIDs(productIDs, numberOfProducts) {
    if (!productIDs || productIDs.length < 1) {
        Logger.error('ProductIDs array is empty.');
        return [];
    }

    if (numberOfProducts > productIDs.length) {
        throw new Error('numberOfProducts param must be lower than productIDs length.');
    }

    var min = 0;
    var max = productIDs.length - 1;
    var randomIDs = [];

    while (randomIDs.length < numberOfProducts) {
        var randomIndex = Math.floor(min + Math.random() * (max + 1 - min));
        var productID = productIDs[randomIndex];

        if (randomIDs.indexOf(productID) === -1) {
            randomIDs.push(productID);
        }
    }

    return randomIDs;
}

/**
 * Generate cropped image on the fly
 * @param {Object} product - view model product
 * @param {Object} imageConfig -  Config object that contains settings for cropping engine
 * @returns {Object} - Object that contains cropped image object
 */
function getCroppedImage(product, imageConfig) {
    let origImages = product.getImages(imageConfig.fromType);
    let result = [];
    if (origImages.length < 0) {
        return result;
    }

    result = collections.map(origImages, function (image, index) {
        let width = imageConfig.w || null;
        let height = imageConfig.h || null;
        let origAbsURL = image.absURL.toString();

        if (width || height) {
            let newConfig = {};

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

module.exports.getCroppedImage = getCroppedImage;
module.exports.generateRandomIDs = generateRandomIDs;
