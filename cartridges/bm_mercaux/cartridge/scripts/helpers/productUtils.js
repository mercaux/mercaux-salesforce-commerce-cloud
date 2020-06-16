'use strict';

/**
 * Search products by SKU
 *
 * @param {Array} data - Array with data of look that has gotten from Mercaux API response
 * @param {function} uploadLookImage - func that is saving image of the look
 * @return {Array.<Object>} - Array of products that were found by SKU field
 */
function searchProductsBySKU(data, uploadLookImage) {
    var result = [];

    for (var i = 0; i < data.length; i++) {
        var searchByRefinement = require('~/cartridge/scripts/helpers/searchByRefinement');
        var product = data[i];
        var origProductID = product.id;
        product.id = 'mercaux-' + origProductID;
        var badgesNames = [];
        var uploadedImagePath = '';
        var assignedProductsIDs = [];

        // Filter conditions to skip looks based on diff criteria:

        // 1. Skip looks without "status: activeObject"

        // if (product.status !== "activeObject") {
        //     continue;
        // }

        // Helper mapping to format data to the formatted query value
        var skuArray = product.products.map(function (productSetProduct) {
            return productSetProduct.sku;
        });

        // Search query format that performs search and pass to the function
        var formattedSearchQuery = skuArray.reduce(function (prev, currentValue, index, array) {
            var line = array[index + 1] ? '|' : '';
            return prev + currentValue + line;
        }, '');

        // Function that executes search by attribute and matched products add to the Look ProductSet. By default is 'manufacturerSKU'
        var searchResultBySKU = searchByRefinement('manufacturerSKU', formattedSearchQuery);

        searchResultBySKU.forEach(function (resultProduct) {
            if (skuArray.indexOf(resultProduct.sku) > -1) {
                assignedProductsIDs.push(resultProduct.productID);
            }
        });

        if (product.badges && product.badges.length > 0) {
            badgesNames = product.badges.map(function (badge) {
                return badge.name;
            });
        }

        if (assignedProductsIDs.length > 0) {
            // Upload Look image
            var imageFullPath = product.imageName;
            if (imageFullPath) {
                uploadedImagePath = uploadLookImage(imageFullPath, product.id);
            }

            result.push({
                product: product,
                uploadedImagePath: uploadedImagePath,
                badgesNames: badgesNames,
                productsOfSet: assignedProductsIDs
            });
        }
    }

    return result;
}

module.exports.searchProductsBySKU = searchProductsBySKU;
