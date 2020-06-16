'use strict';

module.exports = function (object, product) {
    Object.defineProperty(object, 'sku', {
        enumerable: true,
        value: product.manufacturerSKU
    });
};
