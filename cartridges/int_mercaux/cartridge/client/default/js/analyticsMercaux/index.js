/* eslint-disable no-console */
/* eslint-disable camelcase */
'use strict';

/*
 * This file contains Logic to send Analytics data to the backend
 * endpoints via Analytics-Add controller
 */

/**
 * Event name: Look displayed in a page
 * @param {EventListenerObject} e - Event listener object
 * @param {Array} looksIDs Product Look IDs
 * @param {string} endpointURL Endpoint URL of request to do Analytic request
 * @param {function} requestCb Request callback function
 */
function lookDiplayedInPage_event(e, looksIDs, endpointURL, requestCb) {
    var $body = $(e.target);

    var data = {
        event: 'Look Displayed in Page',
        what: looksIDs,
        from: {
            type: null
        },
        when: { timestamp: Date.now() }
    };

    var pageData = getTypeOfEventPage($body);
    data.from = pageData;

    requestCb(endpointURL, data);
}

/**
 * Event name: Look pop-up displayed
 * @param {EventListenerObject} e - Event listener object
 * @param {string} lookID Product Look ID
 * @param {string} endpointURL Endpoint URL of request to do Analytic request
 * @param {function} requestCb Request callback function
 */
function lookPopupDisplayed_event(e, lookID, endpointURL, requestCb) {
    var $body = $(e.target);

    var data = {
        event: 'Look Popup Displayed',
        what: [lookID],
        from: {
            type: null
        },
        when: { timestamp: Date.now() }
    };

    var pageData = getTypeOfEventPage($body);
    data.from = pageData;

    requestCb(endpointURL, data);
}

/**
 * Event name: From product pop-up (desktop only)
 * @param {EventListenerObject} e - Event listener object
 * @param {Object} data object with product data
 * @param {string} endpointURL Endpoint URL of request to do Analytic request
 * @param {function} requestCb Request callback function
 */
function fromProductPopUp_event(e, data, endpointURL, requestCb) {
    var lookID = data.lookID;
    var productSKU = data.productSKU;

    var dataEventObj = {
        event: 'From Product pop-up',
        what: [productSKU],
        from: {
            type: null
        },
        when: { timestamp: Date.now() }
    };

    if (lookID) {
        dataEventObj.from.type = 'Look ID';
        dataEventObj.from.lookID = lookID;
    }

    requestCb(endpointURL, dataEventObj);
}

/**
 * Event name: From add to basket button (mobile only)
 * @param {EventListenerObject} e - Event listener object
 * @param {Object} data object with product data
 * @param {string} endpointURL Endpoint URL of request to do Analytic request
 * @param {function} requestCb Request callback function
 */
function fromAddToBasketBtn_event(e, data, endpointURL, requestCb) {
    var lookID = data.lookID;
    var productSKU = data.productSKU;

    var dataEventObj = {
        event: 'From Add to Basket button (Mobile)',
        what: [productSKU],
        from: {
            type: null
        },
        when: { timestamp: Date.now() }
    };

    if (lookID) {
        dataEventObj.from.type = 'Look ID';
        dataEventObj.from.lookID = lookID;
    }

    requestCb(endpointURL, dataEventObj);
}

/**
 * Event name: Products added to basket
 * @param {EventListenerObject} e - Event listener object
 * @param {Object} data object with product data
 * @param {string} endpointURL Endpoint URL of request to do Analytic request
 * @param {function} requestCb Request callback function
 */
function productsAddedToBasket_event(e, data, endpointURL, requestCb) {
    var lookID = data.lookID;
    var productSKU = data.productSKU;
    var $body = $(e.target);

    var dataEventObj = {
        event: 'Products added to basket',
        what: [productSKU],
        from: {
            type: null
        },
        place: null,
        when: { timestamp: Date.now() }
    };

    if (lookID) {
        dataEventObj.from.type = 'Look ID';
        dataEventObj.from.lookID = lookID;
    }

    var pageData = getTypeOfEventPage($body);
    dataEventObj.place = pageData;

    requestCb(endpointURL, dataEventObj);
}

/**
 * Helper function to get type of Event page
 * @param {JQuery} $body - Body element
 * @returns {Object} Object with data of page type
 */
function getTypeOfEventPage($body) {
    var result = {
        type: '',
        pid: null
    };

    var isHomepage = $body.find('div[class*="home"]').length > 0 || $body.find('.home-main').length > 0;
    var isProductDetailPage = $body.find('.product-detail').length > 0;
    var isLooksGalleryPage = $body.find('#LooksGalleryPage').length > 0;

    if (isHomepage) {
        result.type = 'Homepage';
    } else if (isLooksGalleryPage) {
        result.type = 'LooksGalleryPage';
    } else if (isProductDetailPage) {
        result.type = 'ProductDetail';
        result.pid = $body.find('.container.product-detail').attr('data-pid');
    }

    return result;
}

/**
 *  Produces analytic requests to the backend side
 *  @param {string} endpointURL Endpoint URL of request to do Analytic request
 *  @param {Object} data contain object of analytic data for request
 */
function makeAnalyticsRequest(endpointURL, data) {
    fetch(endpointURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => {
      
    }).catch(e => {
        console.log(e);
    });
}

$(document).ready(function () {
    var $analyticTag = $('.js-mercaux-analytics-tag');
    var endpointURL = $analyticTag.attr('data-mercaux-analytics-url');

    if ($analyticTag.length < 1) {
        console.error('Analytics tag of Mercaux is not defined');
        return;
    }

    $('body').on('analyticsMercaux:LookDisplayedInPage', function (e, data) {
        lookDiplayedInPage_event(e, data.looksIDs, endpointURL, makeAnalyticsRequest);
    });

    $('body').on('analyticsMercaux:LookPopupDisplayed', function (e, data) {
        lookPopupDisplayed_event(e, data.lookID, endpointURL, makeAnalyticsRequest);
    });

    $('body').on('analyticsMercaux:FromProductPopUp', function (e, data) {
        fromProductPopUp_event(e, data, endpointURL, makeAnalyticsRequest);
    });

    $('body').on('analyticsMercaux:FromAddToBasketOnMobile', function (e, data) {
        fromAddToBasketBtn_event(e, data, endpointURL, makeAnalyticsRequest);
    });

    $('body').on('analyticsMercaux:ProductsAddedToBasket', function (e, data) {
        productsAddedToBasket_event(e, data, endpointURL, makeAnalyticsRequest);
    });
});
