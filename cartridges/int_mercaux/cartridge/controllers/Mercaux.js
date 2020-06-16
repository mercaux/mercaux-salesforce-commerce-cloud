/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var helpers = require('*/cartridge/scripts/helpers');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');
var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');

server.get('ShowModal', cache.applyDefaultCache, function (req, res, next) {
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');

    var params = req.querystring;
    var product = ProductFactory.get(params);
    var addToCartUrl = URLUtils.url('Cart-AddProduct');
    var template = product.productType === 'set'
        ? 'modal/parentLook.isml'
        : 'modal/product/productDetail.isml';
    var sizeAttrs = [];

    if (product.variationAttributes) {
        sizeAttrs = product.variationAttributes.filter(function (attribute) {
            return (attribute.attributeId === 'size');
        });
    }

    product.oneSizeProduct = sizeAttrs.length < 1;

    var context = {
        product: product,
        addToCartUrl: addToCartUrl,
        resources: productHelper.getResources(),
        quickViewFullDetailMsg: Resource.msg('link.quickview.viewdetails', 'product', null),
        closeButtonText: Resource.msg('link.quickview.close', 'product', null),
        enterDialogMessage: Resource.msg('msg.enter.quickview', 'product', null),
        template: template
    };

    res.setViewData(context);

    this.on('route:BeforeComplete', function (req, res) {
        var viewData = res.getViewData();
        var renderedTemplate = renderTemplateHelper.getRenderedHtml(viewData, viewData.template);

        res.json({
            renderedTemplate: renderedTemplate,
            productUrl: URLUtils.url('Product-Show', 'pid', viewData.product.id).relative().toString()
        });
    });

    next();
});

server.get('SlideItem', cache.applyPromotionSensitiveCache, function (req, res, next) {
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var viewData = res.getViewData();
    var slideTileParams = {};

    Object.keys(req.querystring).forEach(function (key) {
        slideTileParams[key] = req.querystring[key];
    });

    var product = ProductFactory.get(slideTileParams);
    var slideImage = helpers.getSlideImage(product);

    viewData.product = {
        id: product.id,
        name: product.productName,
        description: product.shortDescription,
        image: slideImage,
        likesCount: product.likesCount
    };

    res.setViewData(viewData);
    res.render('slider/slideItem');

    next();
});

server.get('IncludeSlider', server.middleware.include, cache.applyPromotionSensitiveCache, function (req, res, next) {
    var ContentMgr = require('dw/content/ContentMgr');
    var cid = req.querystring.cid;
    var pid = req.querystring.pid;

    var apiContent = ContentMgr.getContent(cid);

    if (apiContent && apiContent.online && apiContent.template) {
        res.render(apiContent.template, { pid: pid });
    }

    next();
});

server.get('ShowSlider', cache.applyPromotionSensitiveCache, function (req, res, next) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var collections = require('*/cartridge/scripts/util/collections');

    var viewData = res.getViewData();
    var productSets;
    var sliderParams = {};
    var looksSetsResult = [];

    Object.keys(req.querystring).forEach(function (key) {
        sliderParams[key] = req.querystring[key];
    });

    if (!sliderParams.pid) {
        res.json({ productSets: looksSetsResult });
        return next();
    }

    var apiProduct = ProductMgr.getProduct(sliderParams.pid);
    productSets = apiProduct.getProductSets();

    collections.forEach(productSets, function (item) {
        if (item.custom.isMercauxLook) {
            looksSetsResult.push(item.getID());
        }
    });

    viewData.mercauxLooks = looksSetsResult;
    res.setViewData(viewData);

    res.render('slider/productLooks');

    next();
});


server.get('LooksFromCategory', cache.applyPromotionSensitiveCache, function (req, res, next) {
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var searchHelper = require('*/cartridge/scripts/helpers/searchHelpers');
    var template = 'slider/productLooks';

    var apiProductSearch = new ProductSearchModel();
    var viewData = {
        apiProductSearch: apiProductSearch
    };

    res.setViewData(viewData);

    this.on('route:BeforeComplete', function (req, res) {
        var result = searchHelper.search(req, res);
        var numberOfProducts = req.querystring.number;

        var productIdsRaw = result.productSearch.productIds;
        var productIDs = productIdsRaw.map(function (product) { return product.productID; });

        var mercauxLooks = helpers.generateRandomIDs(productIDs, numberOfProducts);

        res.render(template, {
            productSearch: result.productSearch,
            mercauxLooks: mercauxLooks
        });
    });
    return next();
}, pageMetaData.computedPageMetaData);

module.exports = server.exports();
