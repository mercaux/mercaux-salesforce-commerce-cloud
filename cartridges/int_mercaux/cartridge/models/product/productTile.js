'use strict';

var decorators = require('*/cartridge/models/product/decorators/index');

/**
 * Decorate product with product tile information
 * @param {Object} product - Product Model to be decorated
 * @param {dw.catalog.Product} apiProduct - Product information returned by the script API
 * @param {string} productType - Product type information
 *
 * @returns {Object} - Decorated product model
 */
module.exports = function productTile(product, apiProduct, productType) {
    module.superModule(product, apiProduct, productType);

    decorators.isMercauxLook(product, apiProduct);

    if (product.isMercauxLook) {
        decorators.likesCount(product, apiProduct);
        decorators.croppedImage(product, apiProduct, { fromType: 'large', w: 430, h: 520 });
    }

    return product;
};
