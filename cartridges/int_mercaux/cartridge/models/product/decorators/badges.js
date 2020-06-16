'use strict';

module.exports = function (object, product) {
    var badges = product.custom.badges.length > 0 ? product.custom.badges.join(',') : '';
    Object.defineProperty(object, 'badges', {
        enumerable: true,
        value: badges
    });
};
