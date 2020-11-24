/* eslint-disable camelcase */
'use strict';

var ADDED_PRODUCT_DATA = {
    productSKU: null,
    lookID: null
};

$(document).ready(function () {
    initSizeDropdown();

    $('body').on('hide.bs.modal', '#baseMercauxModal', function (e) {
        $('#baseMercauxModal').find('.js-modal-mercaux').empty();
    });

    // Mercaux Analytic on Parent Modal
    $('body').on('click', '.js-product-look-parent-block', function (e) {
        var $selector = $(e.target);

        if ($selector.hasClass('js-add-to-bag-button')) {
            var lookID = $selector.attr('data-pid-look');
            var productSKU = $selector.attr('data-product-sku');

            ADDED_PRODUCT_DATA.productSKU = productSKU;
            ADDED_PRODUCT_DATA.lookID = lookID;
        }
    });

    // Attach data to Mercaux Analytic in child Product modal
    $('body').on('click', '.js-product-look-child-product', function (e) {
        var $selector = $(e.target);

        var $parentModalBlock = $('.js-product-look-child-product').parents('.modal-body-mercaux');
        var lookID = $parentModalBlock.find('.js-pid-look-child-product').attr('data-pid-look');

        if ($selector.hasClass('js-add-to-bag-button')) {
            var productSKU = $selector.attr('data-product-sku');

            ADDED_PRODUCT_DATA.productSKU = productSKU;
            ADDED_PRODUCT_DATA.lookID = lookID;
        }
    });

    $('body').on('product:afterAddToCart', function () {
        // Mercaux Analytics
        if (ADDED_PRODUCT_DATA.productSKU && ADDED_PRODUCT_DATA.lookID) {
            trigger_ProductsAddedToBasket_event(ADDED_PRODUCT_DATA.productSKU, ADDED_PRODUCT_DATA.lookID);
            ADDED_PRODUCT_DATA.productSKU = null;
            ADDED_PRODUCT_DATA.lookID = null;
        }
    });

    $('body').on('product:afterAttributeSelect', function (e, data) {
        var $container = data.container;
        var selectedProductID = data.data.product.id;

        var isParentModal = $container.parents('.js-product-look-parent-block').length > 0;
        if (!isParentModal) {
            e.preventDefault();
            return;
        }

        // Attach data to Mercaux Analytic when attr selects in parent look modal
        var $selectedProduct = $container.find('.mobile-block .js-open-product-look');
        var productSKU = $selectedProduct.attr('data-product-sku');
        var lookID = $selectedProduct.attr('data-pid-look');
        ADDED_PRODUCT_DATA.productSKU = productSKU;
        ADDED_PRODUCT_DATA.lookID = lookID;

        $container.find('.mobile-block .product-id').text(selectedProductID);
        $container.find('button.js-add-to-bag-button').trigger('click');
    });

    $('body').on('lookModal:loaded', function () {
        $('.js-size-btn').each(function () {
            var $button = $(this);
            $button.on('click', function () {
                $(this).find('button').trigger('change');
            });
        });
    });

    /**
     *  Logic for Size dropdown of Add to Cart button on Parent Look popup
     */
    function initSizeDropdown() {
        $('body').on('click', '.js-show-size-attr', function () {
            var productTile = $(this).parents('.product.set-item');
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

        $('body').on('mouseleave', '.modal-content-mercaux .product.set-item', function () {
            var sizeBlockAttrs = $(this).find('.product-attr-block-parent.opened');
            if (sizeBlockAttrs.length > 0) {
                sizeBlockAttrs.hide('fast').removeClass('opened');
                $(this).find('.add-to-cart-block .js-show-size-attr').removeClass('hasOpened');
            }
        });
    }
});

/**
 *  Logic for trigger analytic event
 *  @param {string} productSKU Product SKU
 *  @param {string} lookID Product ID of Look type product
 */
function trigger_ProductsAddedToBasket_event(productSKU, lookID) {
    $('body').trigger('analyticsMercaux:ProductsAddedToBasket', { productSKU: productSKU, lookID: lookID });
}
