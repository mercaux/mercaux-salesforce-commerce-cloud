'use strict';
var Site = require('dw/system/Site');
var helpers = require('*/cartridge/scripts/helpers');

/**
 * Contains logic to render Product Tile on PLP page if it's Looks category
 * @param {Object} obj - Object with tile data
 * @returns {boolean} - Result of execution of hook
 */
function renderProductTile(obj) {
    const { params, productView } = obj;

    var LOOKS_CAT_ID = Site.current.getCustomPreferenceValue('mercaux_CategoryID') || 'Looks';
    var categoryID = params.cgid.stringValue;
    var isHooksExecuted = false;

    var slideImage = helpers.getCroppedImage(productView.product, { fromType: 'large', w: 430, h: 520 });

    productView.lookImage = slideImage;

    if (categoryID && categoryID === LOOKS_CAT_ID) {
        productView.render('looksGallery/producttile');
        isHooksExecuted = true;
    }
    return isHooksExecuted;
}

module.exports.renderProductTile = renderProductTile;
