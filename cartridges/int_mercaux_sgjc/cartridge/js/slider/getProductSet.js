/* eslint-disable camelcase */
/* eslint-disable no-console */
'use strict';

/**
 * Init client-side JS code
 */
function init() {
    var selectors = {
        openProductOfLook: '.js-open-product-look',
        openLookModal: '.js-open-look-modal',
        backToBaseModal: '.js-back-to-base-modal',
        modalBody: '.modal-body',
        jsModalMercaux: '.js-modal-mercaux',
        productBackBlock: '.js-back-btn-block'
    };

    var $jsModalMercaux = $(selectors.jsModalMercaux);

    var CURRENT_WINDOW_WIDTH = 0;
    var BREAKPOINT_MOBILE = 728;

    $(window).on('load', onWindowChange);
    $(window).resize(onWindowChange);

    /*
    *  Handler for Open Product of Look button event
    */
    $('body').on('click', selectors.openProductOfLook, function (e) {
        if (CURRENT_WINDOW_WIDTH <= BREAKPOINT_MOBILE) {
            e.preventDefault();
            return;
        }
        var $selector = $(this);
        var url = $selector.attr('data-url');
        var pid = $selector.attr('data-pid');
        var pidLook = $selector.attr('data-pid-look');

        var backHtmlBtn = `<span class="arrow-back"></span>
                <span
                    class="back-mercaux-btn js-back-to-base-modal"
                    data-url="${url}"
                    data-pid=${pidLook}>
                        Back
                </span> `;

        $(selectors.productBackBlock).append(backHtmlBtn);
        $(selectors.productBackBlock).append("<span class='js-pid-look-child-product' data-pid-look='" + pidLook + "' />");

        getProductData(url, pid, { childProduct: true });

        // Analytics Mercaux
        var productSKU = $(this).attr('data-product-sku');
        trigger_FromProductPopUp_event(productSKU, pidLook);
    });

    /*
    *  Handler for open modal with Looks event
    */
    $('body').on('click', selectors.openLookModal, function (e) {
        e.preventDefault();
        onProductDataLoad.call(this, { backBtn: false, childProduct: false });
    });

    /*
    *  Handler for back button to move to base parent modal
    */
    $('body').on('click', selectors.backToBaseModal, function (e) {
        e.preventDefault();
        onProductDataLoad.call(this, { backBtn: true, childProduct: false });
    });

    /**
     * On change window event listener
     */
    function onWindowChange() {
        CURRENT_WINDOW_WIDTH = this.innerWidth;
    }

    /**
      * Event listener method to handle product load logic
      * @param {Object} options options object for modal handling
      */
    function onProductDataLoad(options) {
        var $selector = $(this);

        $(selectors.productBackBlock).empty();

        var url = $selector.attr('data-url');
        var pid = $selector.attr('data-pid');

        // Analytics Mercaux
        var sliderTargetAttr = $(this).attr('data-target');
        if (sliderTargetAttr && pid) {
            trigger_LookPopupDisplayed_event(pid);
        }

        getProductData(url, pid, options);
    }

    /**
      * Method to handle product load logic from Controller API
      * @param {string} url Endpoint URL to do request to get the data
      * @param {string} pid Product ID
      * @param {Object} options options object for modal handling
      */
    function getProductData(url, pid, options) {
        var getUrl = url + '?pid=' + pid;

        var isChildProduct = options && options.childProduct;
        var isBackBtn = options && options.backBtn;

        $jsModalMercaux.empty();

        if (!pid) return;

        $.ajax({
            url: getUrl,
            method: 'GET',
            success: function (data) {
                $jsModalMercaux.append(data);

                if (isChildProduct || isBackBtn) {
                    $('body').trigger('childModalProduct:loaded');
                    return;
                }
                if (!isBackBtn || !isChildProduct) {
                    $('body').trigger('lookModal:loaded');
                    return;
                }
            },
            error: function (e) {
                console.error(e, 'Error modal!');
            }
        });
    }

    // Analytics Mercaux
    $('body').on('click', '.js-product-look-parent-block', function (e) {
        var $selector = $(e.target).parents('.js-product-look-parent-block');

        setTimeout(function () {
            var isProductAdded = $('.mini-cart-content').is(':visible');
            var pidLook;
            var productSKU;

            // Trigger Analytic on mobile parent modal
            if (isProductAdded && CURRENT_WINDOW_WIDTH <= BREAKPOINT_MOBILE) {
                pidLook = $selector.attr('data-product-set-id');
                productSKU = $selector.find('.product-title span.js-open-product-look').attr('data-product-sku');

                trigger_FromAddToBasketMobile_event(productSKU, pidLook);
            }

            // Trigger Analytic on desktop parent modal
            if (isProductAdded && CURRENT_WINDOW_WIDTH > BREAKPOINT_MOBILE) {
                pidLook = $selector.attr('data-product-set-id');
                productSKU = $selector.find('.product-title span.js-open-product-look').attr('data-product-sku');

                trigger_ProductsAddedToBasket_event(productSKU, pidLook);
            }
        }, 1000);
    });

    /**
     *  Logic for trigger analytic event
     *  @param {string} lookID Product ID of Look type product
     */
    function trigger_LookPopupDisplayed_event(lookID) {
        $('body').trigger('analyticsMercaux:LookPopupDisplayed', { lookID: lookID });
    }

    /**
     *  Logic for trigger analytic event
     *  @param {string} productSKU Product SKU
     *  @param {string} lookID Product ID of Look type product
     */
    function trigger_FromProductPopUp_event(productSKU, lookID) {
        $('body').trigger('analyticsMercaux:FromProductPopUp', { lookID: lookID, productSKU: productSKU });
    }

    /**
     *  Logic for trigger analytic event
     *  @param {string} productSKU Product SKU
     *  @param {string} lookID Product ID of Look type product
     */
    function trigger_FromAddToBasketMobile_event(productSKU, lookID) {
        $('body').trigger('analyticsMercaux:FromAddToBasketOnMobile', { lookID: lookID, productSKU: productSKU });
    }

    /**
     *  Logic for trigger analytic event
     *  @param {string} productSKU Product SKU
     *  @param {string} lookID Product ID of Look type product
     */
    function trigger_ProductsAddedToBasket_event(productSKU, lookID) {
        $('body').trigger('analyticsMercaux:ProductsAddedToBasket', { productSKU: productSKU, lookID: lookID });
    }
}

module.exports = function () {
    $(document).ready(function () {
        init();
    });
};
