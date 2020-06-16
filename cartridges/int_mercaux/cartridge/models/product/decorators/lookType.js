'use strict';

module.exports = function (object, product) {
    Object.defineProperty(object, 'lookType', {
        enumerable: true,
        value: product.custom.lookType.value
    });
};
