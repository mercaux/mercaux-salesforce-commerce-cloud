'use strict';

module.exports = function (object, product) {
    Object.defineProperty(object, 'isMercauxLook', {
        enumerable: true,
        value: product.custom.isMercauxLook
    });
};
