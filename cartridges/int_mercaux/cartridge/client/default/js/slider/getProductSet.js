/* eslint-disable camelcase */
/* eslint-disable no-console */
'use strict';

var selectors = {
    openProductOfLook: '.js-open-product-look',
    openLookModal: '.js-open-look-modal',
    backToBaseModal: '.js-back-to-base-modal',
    modalBody: '.modal-body',
    jsModalMercaux: '.js-modal-mercaux',
    productBackBlock: '.js-back-btn-block'
};

var $jsModalMercaux = $(selectors.jsModalMercaux);
var $modalBody = $(selectors.modalBody);

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

    var url = $(this).attr('data-url');
    var pid = $(this).attr('data-pid');
    var pidLook = $(this).attr('data-pid-look');

    var backHtmlBtn = `<span class="arrow-back"></span>
            <span
                class="back-mercaux-btn js-back-to-base-modal"
                data-url="${url}"
                data-pid=${pidLook}>
                     Back
            </span> `;

    $(selectors.productBackBlock).append(backHtmlBtn);
    $(selectors.productBackBlock).append("<span class='js-pid-look-child-product' data-pid-look='" + pidLook + "' />");

    // Analytics Mercaux
    var productSKU = $(this).attr('data-product-sku');

    trigger_FromProductPopUp_event(productSKU, pidLook);

    getProductData(url, pid);
});

/*
 *  Handler for open modal with Looks event
 */
$('body').on('click', selectors.openLookModal, onProductDataLoad);

/*
 *  Handler for back button to move to base parent modal
 */
$('body').on('click', selectors.backToBaseModal, onProductDataLoad);

/**
 * On change window event listener
 */
function onWindowChange() {
    CURRENT_WINDOW_WIDTH = this.innerWidth;
}

/**
 * Event listener method to handle product load logic
 * @param {EventListenerObject} e Event listener object
 */
function onProductDataLoad(e) {
    e.preventDefault();

    $(selectors.productBackBlock).empty();

    var url = $(this).attr('data-url');
    var pid = $(this).attr('data-pid');

    // Analytics Mercaux
    var sliderTargetAttr = $(this).attr('data-target');
    if (sliderTargetAttr && pid) {
        trigger_LookPopupDisplayed_event(pid);
    }

    getProductData(url, pid);
}

/**
 * Method to handle product load logic from Controller API
 * @param {string} url Endpoint URL to do request to get the data
 * @param {string} pid Product ID
 */
function getProductData(url, pid) {
    var getUrl = url + '?pid=' + pid;

    $jsModalMercaux.empty();
    $modalBody.spinner().start();

    if (!pid) return;

    $.ajax({
        url: getUrl,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            var htmlPopUp = data.renderedTemplate;

            $jsModalMercaux.append(htmlPopUp);
            $('body').trigger('lookModal:loaded');
            $.spinner().stop();
        },
        error: function () {
            $.spinner().stop();
            console.error('Error modal!');
        }
    });
}

// Analytics Mercaux Only Mobile
$('body').on('click', '.js-product-look-parent-block', function (e) {
    var $selector = $(e.target);

    if ($selector.hasClass('js-show-size-attr') && CURRENT_WINDOW_WIDTH <= BREAKPOINT_MOBILE) {
        var pidLook = $selector.attr('data-pid-look');
        var productSKU = $selector.attr('data-product-sku');

        trigger_FromAddToBasketMobile_event(productSKU, pidLook);
    }
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
