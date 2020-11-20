/* eslint-disable no-useless-escape */
'use strict';

/**
 * Check if response type is JSON
 * @param {dw.net.HTTPClient} client HTTPClient object
 * @returns {boolean} boolean result if response is JSON format
 */
function isResponseJSON(client) {
    var contentTypeHeader = client.getResponseHeader('Content-Type');
    return contentTypeHeader && contentTypeHeader.split(';')[0].toLowerCase() === 'application/json';
}

/**
 * Generate mock response and provide methods for use in parse Response method
 * @param {Object} mockObj mockObject
 * @returns {Object} mocked service methods
 */
function generateMockResponse(mockObj) {
    return {
        getStatus: function () {
            return mockObj.status;
        },
        getStatusCode: function () {
            return mockObj.statusCode;
        },
        getMsg: function () {
            return mockObj.msg;
        },
        getStatusMessage: function () {
            return mockObj.statusMsg;
        },
        isMockResult: function () {
            return true;
        },
        errorText: mockObj.errorText,
        text: mockObj.text
    };
}

/**
* Extract base URL
* @param {string} fullUrl - full url string
* @returns {string} - Base URL
*/
function extractBaseUrl(fullUrl) {
    var baseUrl = fullUrl.match(/(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}/gi);
    return baseUrl;
}

module.exports = {
    isResponseJSON: isResponseJSON,
    generateMockResponse: generateMockResponse,
    extractBaseUrl: extractBaseUrl
};
