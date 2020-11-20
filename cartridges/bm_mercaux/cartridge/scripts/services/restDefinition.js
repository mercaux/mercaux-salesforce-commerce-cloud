'use strict';

var StringUtils = require('dw/util/StringUtils');
var logger = require('dw/system/Logger').getLogger('Mercaux');
var serviceHelpers = require('~/cartridge/scripts/services/helpers');

const endpoints = {
    get: {
        looks: 'look/'
    }
};

/**
 * Insert authorization service into request header
 * @param {dw.svc.HTTPService} svc - service instance
 * @throws {Error} Throws error when API key is not available or wasn't correct.
 */
function setAuthHeader(svc) {
    var apiKey = svc.getConfiguration().getCredential().getPassword();
    if (!apiKey) {
        throw Error('Mercaux API key is not configured');
    }
    svc.addHeader('X-MercauxApikey', apiKey);
    svc.setAuthentication('NONE');
}

/**
 * Set request url for service
 * @param {dw.svc.HTTPService} svc - service instance
 * @param {String} relativeUrl - service instance
 * @throws {Error} Throws error when API key is not available or wasn't correct.
 */
function setURL(svc, relativeURL) {
    var baseURL = svc.getURL();
    var absoluteURL;
    if (relativeURL.slice(0, 1) === '/') {
        absoluteURL = serviceHelpers.extractBaseUrl(baseURL) + relativeURL;
    } else if (baseURL.slice(-1) === '/') {
        absoluteURL = baseURL + relativeURL;
    } else {
        absoluteURL = baseURL + '/' + relativeURL;
    }
    svc.setURL(absoluteURL)
}

/**
 * Parses response JSON and wraps with an object containing additional helper properties
 * @param {dw.svc.HTTPService} svc - service instance
 * @param {dw.net.HTTPClient} client - http client
 * @returns {{responseObj: Object, isError: boolean, statusCode: string, msg: string, errorText: string}} - server response
 */
function parseResponse(svc, client) {
    var result = {}

    if (serviceHelpers.isResponseJSON(client)) {
        try {
            result.data = JSON.parse(client.text).data;
        } catch (e) {
            logger.error('Error on parse JSON response: ', e.message);
        }
    }
    if (client.getStatusCode() === 204) {
        result.data = [];
    }
    if (client.getStatusCode() === 206) {
        var pagingHeader = client.getResponseHeader('X-MercauxPagingData');
        result.pagingData = pagingHeader;
    }
    return result
}

/**
 * Define service definition to Get All Looks request of the Mercaux API
 * @returns {{ createRequest, parseResponse, mockCall }} - service definition object
 */
function fetchLookImageDef() {
    /**
     * Define a request object to be used when calling the service.
     * @param {dw.svc.HTTPService} svc - service instance
     * @returns {null} null
     */
    function createRequest(svc, params) {
        setAuthHeader(svc);
        setURL(svc, params.imageName);
        svc.setRequestMethod('GET');
        svc.setOutFile(params.saveToFile);
        return null;
    }

    function filterLogMessage(msg) {
        return msg; // it's never passing sensitive data
    }

    return {
        createRequest: createRequest,
        parseResponse: parseResponse,
        filterLogMessage: filterLogMessage
    };
}

/**
 * Define service definition to Get Look Preview Image request of the Mercaux API
 * @returns {{ createRequest, parseResponse, mockCall }} - service definition object
 */
function fetchAllLooksDef() {
    /**
     * Define a request object to be used when calling the service.
     * @param {dw.svc.HTTPService} svc - service instance
     * @param {Object} params - params object
     * @returns {null} null
     */
    function createRequest(svc, params) {
        setAuthHeader(svc);
        setURL(svc, endpoints.get.looks);

        if (params && params.pagingData) {
            svc.addHeader('X-MercauxPagingData', params.pagingData);
        }
        if (params && params.query) {
            svc.addParam('query', params.query);
        }
        svc.setRequestMethod('GET');
        return null;
    }

    /**
     * Define a mock call service
     * @param {dw.svc.HTTPService} svc - service instance
     * @param {Object} params - params object
     * @returns {Object} mocked service methods
     */
    function mockCall() {
        var obj = {
            data: [
                {
                    id: 999,
                    name: 'Mock Look 1'
                }
            ]
        };

        var mockRes = {
            status: 'OK',
            statusCode: 200,
            msg: '',
            statusMsg: '',
            errorText: '',
            text: obj
        };

        return serviceHelpers.generateMockResponse(mockRes);
    }

    function filterLogMessage(msg) {
        return msg; // it's never passing sensitive data
    }

    return {
        createRequest: createRequest,
        parseResponse: parseResponse,
        mockCall: mockCall,
        filterLogMessage: filterLogMessage
    };
}

module.exports = {
    endpoints: endpoints,
    service: {
        fetchAllLooks: fetchAllLooksDef,
        fetchLookImage: fetchLookImageDef
    }
};
