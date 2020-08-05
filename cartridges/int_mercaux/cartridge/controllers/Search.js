/* eslint-disable no-shadow */
'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var Site = require('dw/system/Site');

server.extend(module.superModule);
var LOOKS_CAT_ID = Site.current.getCustomPreferenceValue('mercaux_CategoryID') || 'Looks';

server.append('Refinebar', cache.applyDefaultCache, function (req, res, next) {
    var viewData = res.getViewData();
    var categoryID = viewData.productSearch.category.id;

    if (categoryID === LOOKS_CAT_ID) {
        res.render('searchLooksGallery/searchRefineBar');
    }
    next();
}, pageMetaData.computedPageMetaData);

server.append('ShowAjax', cache.applyShortPromotionSensitiveCache, consentTracking.consent, function (req, res, next) {
    var viewData = res.getViewData();
    var productSearch = viewData.productSearch;
    var categoryID = productSearch.category.id;
    var selectedFilters = productSearch.selectedFilters;

    viewData.selectedFilters = selectedFilters;
    res.setViewData(viewData);

    if (categoryID === LOOKS_CAT_ID) {
        res.render('searchLooksGallery/searchResultsNoDecorator');
        return next();
    }

    return next();
}, pageMetaData.computedPageMetaData);

server.append('UpdateGrid', function (req, res, next) {
    var viewData = res.getViewData();
    var productSearch = viewData.productSearch;
    var categoryID = productSearch.category.id;

    this.on('route:BeforeComplete', function (req, res) {
        if (categoryID === LOOKS_CAT_ID) {
            res.render('searchLooksGallery/productGrid');
        }
    });

    next();
});


module.exports = server.exports();
