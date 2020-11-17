'use strict';

var imageCongig = {
        scaleWidth: 172,
        scaleHeight: 172,
        scaleMode: "fit"
    };

/**
 * Determines whether every list item meets callback's truthy conditional
 *
 * @param {dw.catalog.ProductVariationModel} pvm - ProductVariationModel to get required options
 * @return {String} - required options string to be shown
 */
function requiredOptions(pvm) {
    var it = pvm.getProductVariationAttributes().iterator();
    var array = [];
    var options = '';
    var requiredOptions = '';
    while (it.hasNext()) {
        var text = it.next();
        array.push(text.displayName);
    }
    options = array.join(', ');
    var lastIndex = options.lastIndexOf(',');
    if (lastIndex > 0 && options.length > 1 && array.length > 1) {
        requiredOptions = options.substr(0,lastIndex) + ' ' + Resource.msg('product.attributedivider', 'product', null) + options.substr(lastIndex+1, options.length);
    } else {
        requiredOptions = options;
    }

    return requiredOptions;
}

module.exports = {
    imageCongig: imageCongig,
    requiredOptions: requiredOptions
};
