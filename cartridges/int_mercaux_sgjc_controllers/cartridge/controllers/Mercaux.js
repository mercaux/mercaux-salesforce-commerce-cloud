/* eslint-disable no-undef */
'use strict';

/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

var helpers = require('*/cartridge/scripts/helpers');
var collections = require('*/cartridge/scripts/util/collections');

/**
 * Controller for all storefront processes.
 *
 * @module controllers/Mercaux
 */
function showModal() {
    var params = request.httpParameterMap;
    let response = require('*/cartridge/scripts/util/Response');
    let pid = params.pid.stringValue;

    const Product = app.getModel('Product');
    const product = Product.get(pid);
    const template = product.object.productSet ? 'modal/parentLook' : 'modal/product/productDetail.isml';
    if (product.isVisible()) {
        app.getView('Product', {
            product: product,
            DefaultVariant: product.getVariationModel().getDefaultVariant(),
            CurrentOptionModel: product.updateOptionSelection(params),
            CurrentVariationModel: product.updateVariationSelection(params)
        }).render(product.getTemplate() || template);
    } else {
        response.setStatus(410);
        app.getView().render('error/notfound');
    }
}

/**
 * Controller for Include Slider on the page
 *
 * @module controllers/Mercaux
 */
function includeSlider() {
    var ContentMgr = require('dw/content/ContentMgr');
    var cid = request.httpParameterMap.cid;
    var pid = request.httpParameterMap.pid;

    var apiContent = ContentMgr.getContent(cid);

    if (apiContent && apiContent.online && apiContent.template) {
        app.getView({ pid: pid })
         .render(apiContent.template);
    }
}

/**
 * Controller for Showing Slider on the page
 *
 * @module controllers/Mercaux
 */
function showSlider() {
    var ProductMgr = require('dw/catalog/ProductMgr');

    var pid = request.httpParameterMap.pid;

    var looksSetsResult = [];
    var product = null;
    var apiProduct = ProductMgr.getProduct(pid);

    if (apiProduct.isVariant()) {
        product = apiProduct.getMasterProduct();
    } else {
        product = apiProduct;
    }

    var productSets = product.getProductSets();

    collections.forEach(productSets, function (item) {
        if (item.custom.isMercauxLook) {
            looksSetsResult.push(item.getID());
        }
    });

    app.getView({ mercauxLooks: looksSetsResult }).render('slider/productLooks');
}

/**
 * Controller for render Slide Item on the Sliders
 *
 * @module controllers/Mercaux
 */
function slideItem() {
    var slidePID = request.httpParameterMap.pid.stringValue;

    const Product = app.getModel('Product');
    const product = Product.get(slidePID);

    var slideImage = helpers.getCroppedImage(product, { fromType: 'large', w: 430, h: 520 });

    const viewProduct = {
        id: product.getID(),
        name: product.getName(),
        description: product.getShortDescription(),
        image: slideImage,
        likesCount: product.getValue('likesCount')
    };

    app.getView({ product: viewProduct }).render('slider/slideItem');
}

/**
 * Controller for render Slider on the Content Slots
 *
 * @module controllers/Mercaux
 */
function looksFromCategory() {
    var PagingModel = require('dw/web/PagingModel');
    var params = request.httpParameterMap;
    var template = 'slider/productLooks';
    var numberOfProducts = params.number.intValue;

    // Constructs the search based on the HTTP params and sets the categoryID.
    var Search = app.getModel('Search');
    var productSearchModel = Search.initializeProductSearchModel(params);

    // Executes the product search.
    productSearchModel.search();

    var productPagingModel = new PagingModel(productSearchModel.productSearchHits, productSearchModel.count);
    productPagingModel.setPageSize(params.sz.intValue);

    var productIdsRaw = productPagingModel.pageElements;

    if (productPagingModel.count < 1) {
        app.getView({ mercauxLooks: [] }).render(template);
        return;
    }

    var productIDs = collections.map(productIdsRaw, function (product) { return product.productID; });
    const randomProductIDs = helpers.generateRandomIDs(productIDs, numberOfProducts);

    app.getView({ mercauxLooks: randomProductIDs }).render(template);
}

/** Renders the show modal.
 * @see module:controllers/Mercaux~showModal */
exports.ShowModal = guard.ensure(['get'], showModal);
exports.ShowModal.public = true;

/** Renders the Include Slider.
 * @see module:controllers/Mercaux~includeSlider */
exports.IncludeSlider = guard.ensure(['get'], includeSlider);
exports.IncludeSlider.public = true;

/** Renders the ShowSlider
 * @see module:controllers/Mercaux~showSlider */
exports.ShowSlider = guard.ensure(['get'], showSlider);
exports.ShowSlider.public = true;

/** Renders the SlideItem
 * @see module:controllers/Mercaux~slideItem */
exports.SlideItem = guard.ensure(['get'], slideItem);
exports.SlideItem.public = true;

/** Renders the LooksFromCategory
 * @see module:controllers/Mercaux~LooksFromCategory */
exports.LooksFromCategory = guard.ensure(['get'], looksFromCategory);
exports.LooksFromCategory.public = true;
