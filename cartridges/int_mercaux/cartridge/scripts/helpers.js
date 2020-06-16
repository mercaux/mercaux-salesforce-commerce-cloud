/* eslint-disable no-mixed-operators */
'use strict';

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
 * Get Slide Image object from view model product
 * @param {Object} product - product model
 * @returns {Object} - Image object with data from the view model product
 */
function getSlideImage(product) {
    var imageObj = null;

    if (product.slideImage) {
        imageObj = product.slideImage;
    } else if (product.images.medium && product.images.medium.length > 0) {
        imageObj = product.images.medium[0];
    } else if (product.images.large && product.images.large.length > 0) {
        imageObj = product.images.large[0];
    }

    return imageObj;
}

module.exports.getSlideImage = getSlideImage;
module.exports.generateRandomIDs = generateRandomIDs;
