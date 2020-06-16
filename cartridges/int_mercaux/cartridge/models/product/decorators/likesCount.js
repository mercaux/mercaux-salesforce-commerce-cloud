'use strict';

module.exports = function (object, product) {
    Object.defineProperty(object, 'likesCount', {
        enumerable: true,
        value: product.custom.likesCount
    });
};
