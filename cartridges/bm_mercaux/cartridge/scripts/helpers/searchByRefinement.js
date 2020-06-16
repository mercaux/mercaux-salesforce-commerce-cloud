'use strict';

/**
 * Set search configuration values
 *
 * @param {dw.catalog.ProductSearchModel} apiProductSearch - API search instance
 * @param {Object} refinementAttrName - Provided HTTP refinement attribute
 * @param {Object} searchValue - Provided Search Value
 * @return {dw.catalog.ProductSearchModel} - API search instance
 */
function setupSearch(apiProductSearch, refinementAttrName, searchValue) {
    if (refinementAttrName) {
        apiProductSearch.setRefinementValues(refinementAttrName, [searchValue]);
    }
    apiProductSearch.setRecursiveCategorySearch(true);

    return apiProductSearch;
}

/**
 * performs a search
 *
 * @param {Object} refinementAttribute - Refinement attribute HTTP query parameters
 * @param {Object} mercauxSKUs - Provided HTTP query SKU value for search
 * @return {Object} - an object with relevant search information
 */
function searchByRefinement(refinementAttribute, mercauxSKUs) {
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var ProductSearch = require('~/cartridge/models/search/productSearch');
    var productSearch;

    var apiProductSearch = new ProductSearchModel();
    apiProductSearch = setupSearch(apiProductSearch, refinementAttribute, mercauxSKUs);
    apiProductSearch.search();

    var searchParams = {
        sz: 99
    };

    productSearch = new ProductSearch(
        apiProductSearch,
        searchParams,
        [],
        CatalogMgr.getSortingOptions(),
        CatalogMgr.getSiteCatalog().getRoot()
    );
    var products = productSearch.productIds;

    if (products.length < 1) {
        return [];
    }

    var filteredProducts = products.filter(function (product) {
        var productSearchHit = product.productSearchHit;
        var hitType = productSearchHit.getHitType();
        return (hitType !== productSearchHit.HIT_TYPE_PRODUCT_SET);
    });

    /**
     * Retrivie SKU value from product object
     *
     * @param {dw.catalog.Product} product - product object
     * @param {Object} mercauxSKUs - Provided HTTP query SKU value for search
     * @return {Object} - an object with relevant search information
     */
    function getSKU(product) {
        if (product.getManufacturerSKU()) {
            return product.getManufacturerSKU();
        }
        return null;
    }

    // Prepare search results data
    var mappedSKUsProduct = filteredProducts.map(function (searchResultObj) {
        var producSearchtHit = searchResultObj.productSearchHit;
        var product = producSearchtHit.getProduct();
        var hitType = producSearchtHit.getHitType();

        if (hitType === producSearchtHit.HIT_TYPE_PRODUCT_MASTER || hitType === producSearchtHit.HIT_TYPE_VARIATION_GROUP) {
            var masterSKU = getSKU(product);
            if (masterSKU) {
                return {
                    productID: product.getID(),
                    sku: masterSKU
                };
            }
            var firstProduct = producSearchtHit.getFirstRepresentedProduct();
            return {
                productID: firstProduct.getID(),
                sku: getSKU(firstProduct)
            };
        }

        if (getSKU(product)) {
            return {
                productID: product.getID(),
                sku: getSKU(product)
            };
        }

        return {
            productID: null,
            sku: null
        };
    });

    return mappedSKUsProduct;
}

module.exports = searchByRefinement;
