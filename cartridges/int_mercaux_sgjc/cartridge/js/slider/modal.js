/* eslint-disable camelcase */
'use strict';

// Path to minicart.js file from app_storefront_core cartridge
const minicartSetup = require('../../../../app_storefront_core/cartridge/js/minicart');
// Path to product.js file from app_storefront_core cartridge
const productSetup = require('../../../../app_storefront_core/cartridge/js/pages/product');
const ratingLogic = require('../helpers/ratingLogic');

window.MERCAUX_GLOBAL_ratingLogic = ratingLogic;

/**
 *  Init modal client-side logic
 */
function init() {
    $(document).ready(function () {
        initSizeDropdown();

        $('body').on('hide.bs.modal', '#baseMercauxModal', function () {
            $('#baseMercauxModal').find('.js-modal-mercaux').empty();
            $('#pdpMainOld').attr('id', 'pdpMain');
            $('#product-contentOld').attr('id', 'product-content');
            $('#mini-cart').removeClass('openned-modal');
        });

        $('body').on('childModalProduct:loaded', function () {
            minicartSetup.init();
            productSetup.initializeEvents();
        });

        $('body').on('childProductContent.isml:loaded', function () {
            ratingLogic.init();
        });

        $('body').on('lookModal:loaded', function () {
            $('#pdpMain').attr('id', 'pdpMainOld');
            $('#product-content').attr('id', 'product-contentOld');
            $('#mini-cart').addClass('openned-modal');

            minicartSetup.init();
            productSetup.initializeEvents();
        });

        // Attach data to Mercaux Analytic in child Product modal
        $('body').on('click', '.js-product-look-child-product', function (e) {
            var $selector = $(e.target).parents('.js-product-look-child-product');
            var $parentLookID = $(e.target).parents('.modal-body-mercaux').find('.js-pid-look-child-product').attr('data-pid-look') || null;

            $('body').on('minicart:showed', function () {
                var pidLook = $parentLookID;
                var productSKU = $selector.find('h4.product-name').attr('data-product-sku');

                trigger_ProductsAddedToBasket_event(productSKU, pidLook);
            });
        });

        $('body').on('productVariationTileModal.isml:loaded', function (e, data) {
           
            var $productSelectedTile = $('.product[data-pid="' + data.selectedPID + '"]');
            var $selectedSizeBtn = $productSelectedTile.find('.js-size-refinement-block .selectable.selected a.swatchanchor');
            var $addToCartBtn = $productSelectedTile.find('button.add-to-cart');

            var isMasterProduct = data.isMaster === "true";
            if (isMasterProduct) {
                $addToCartBtn.css('opacity', 1);
                return;
            }

            if (!$addToCartBtn.disabled) {
                $addToCartBtn.trigger('click');  
                $addToCartBtn.css('opacity', 0.5).attr('disabled', 'disabled');
            }

            $('body').on('minicart:showed', function () {
                setTimeout(function() {
                    $selectedSizeBtn.trigger('click'); 
                }, 1000);
            }); 
        });
 
    });

    /**
     *  Logic for trigger analytic event
     *  @param {string} productSKU product SKU
     *  @param {string} lookID Look ID
     */
    function trigger_ProductsAddedToBasket_event(productSKU, lookID) {
        $('body').trigger('analyticsMercaux:ProductsAddedToBasket', { productSKU: productSKU, lookID: lookID });
    }

    /**
     *  Logic for Size dropdown of Add to Cart button on Parent Look popup
     */
    function initSizeDropdown() {
        $('.product-size-ref-item .swatchanchor.disabled').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        $('.js-size-btn').each(function () {
            var $button = $(this);
            $button.on('click', function () {
                $(this).find('button').trigger('change');
            });
        });

        $('body').on('click', '.js-show-size-attr', function (e) {
            var productTile = $(this).parents('.product-set-item');
            var sizeBlockAttrs = productTile.find('.product-attr-block-parent');
            var hasOpennedSizes = sizeBlockAttrs.hasClass('opened');

            if (hasOpennedSizes) {
                sizeBlockAttrs.hide('fast').removeClass('opened');
                $(this).removeClass('hasOpened');
            } else {
                sizeBlockAttrs.show('fast').addClass('opened');
                $(this).addClass('hasOpened');
            }
        });

        $('body').on('mouseleave', '.modal-content-mercaux .product-set-item', function () {
            var sizeBlockAttrs = $(this).find('.product-attr-block-parent.opened');
            if (sizeBlockAttrs.length > 0) {
                sizeBlockAttrs.hide('fast').removeClass('opened');
                $(this).find('.add-to-cart-block .js-show-size-attr').removeClass('hasOpened');
            }
        });  
    }
}

module.exports = init;
