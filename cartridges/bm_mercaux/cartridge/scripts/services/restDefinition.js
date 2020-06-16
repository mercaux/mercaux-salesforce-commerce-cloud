'use strict';

var StringUtils = require('dw/util/StringUtils');
var logger = require('dw/system/Logger').getLogger('Mercaux');
var serviceHelpers = require('~/cartridge/scripts/services/helpers');

const endpoints = {
    get: {
        looks: 'look'
    }
};

/**
 * Insert authorization service into request header
 * @param {dw.svc.HTTPService} svc - service instance
 * @param {dw.svc.HTTPService} endpoint - part  call
 * @throws {Error} Throws error when API key is not available or wasn't correct.
 */
function setAuthHeader(svc, endpoint) {
    var svcPassword = svc.getConfiguration().getCredential().getPassword();
    var url = svc.getURL();

    svc.addHeader('X-MercauxApikey', svcPassword);
    svc.setAuthentication('NONE');
    var formatedURL = StringUtils.format('{0}/{1}/', url, endpoint);
    svc.setURL(formatedURL);
}

/**
 * Parses response JSON and wraps with an object containing additional helper properties
 * @param {dw.svc.HTTPService} svc - service instance
 * @param {dw.net.HTTPClient} client - http client
 * @returns {{responseObj: Object, isError: boolean, statusCode: string, msg: string, errorText: string}} - server response
 */
function parseResponse(svc, client) {
    var parsedBody;
    var isJSON = false;
    var response = {};

    // eslint-disable-next-line no-prototype-builtins
    if (client.hasOwnProperty('isMockResult') && client.isMockResult()) {
        response.isMock = client.isMockResult();
    } else {
        isJSON = serviceHelpers.isResponseJSON(client);
    }

    if (isJSON) {
        try {
            parsedBody = JSON.parse(client.text);
        } catch (e) {
            logger.error('Error on parse JSON response: ', e.message);
            parsedBody = client.text;
        }
    } else {
        parsedBody = client.text;
    }
    if (client.getStatusCode() === 206) {
        var pagingHeader = client.getResponseHeader('X-MercauxPagingData');
        parsedBody.pagingHeader = pagingHeader;
    }

    return {
        isError: client.getStatusCode() >= 400,
        statusCode: client.getStatusCode(),
        msg: client.getStatusMessage(),
        responseObj: parsedBody,
        errorText: client.errorText
    };
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
    function createRequest(svc) {
        setAuthHeader(svc, '');
        svc.setRequestMethod('GET');
        return null;
    }

    return {
        createRequest: createRequest,
        parseResponse: parseResponse
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
        setAuthHeader(svc, endpoints.get.looks);

        if (params && params.pagingHeader) {
            svc.addHeader('X-MercauxPagingData', params.pagingHeader);
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

    return {
        createRequest: createRequest,
        parseResponse: parseResponse,
        mockCall: mockCall
    };
}

module.exports = {
    endpoints: endpoints,
    service: {
        fetchAllLooks: fetchAllLooksDef,
        fetchLookImage: fetchLookImageDef
    }
};
