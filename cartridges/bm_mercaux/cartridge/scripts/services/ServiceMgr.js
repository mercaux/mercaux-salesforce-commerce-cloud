'use strict';

var logger = require('dw/system/Logger').getLogger('Mercaux');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var HTTPClient = require('dw/net/HTTPClient');
var File = require('dw/io/File');
var serviceHelpers = require('~/cartridge/scripts/services/helpers');
var rest = require('~/cartridge/scripts/services/restDefinition');
var SERVICE_ID = 'int_mercaux_api_service';
var CATALOG_BASE_PREFIX = '/CATALOGS';

/**
 * Constructs and configures a service with a callback.
 * @param {string} serviceID - Service ID
 * @param {Object} definition - service definition object
 * @returns {dw.svc.Service} -  return a call-specific configuration of Service.
 */
function createService(serviceID, definition) {
    return LocalServiceRegistry.createService(serviceID, definition);
}

/**
 * Creates error object if any
 * @param {dw.svc.Result} Result - result of a service call.
 * @returns {Object|boolean} -  return error object or false boolean
 */
function printError(Result) {
    var responseObj = {
        isError: true,
        statusCode: Result.status,
        errorText: Result.errorMessage,
        errorCode: Result.error,
        msg: Result.msg
    };

    return (Result.status === 'ERROR') ? responseObj : false;
}

module.exports = {
    getLooks: function (requestParams) {
        var service = createService(SERVICE_ID, rest.service.fetchAllLooks());
        var Result = service.call(requestParams || '');
        var responseObject = null;

        if (printError(Result)) return printError(Result);

        try {
            responseObject = Result.getObject();
        } catch (error) {
            logger.error('Error in when parse response from service: ', error);
        }

        return responseObject;
    },
    saveLookImage: function (fullImageURL, productId, catalogId, catalogImageBasePath) {
        var service = createService(SERVICE_ID, rest.service.fetchLookImage());
        var serviceConfig = service.getConfiguration();
        var serviceCreds = serviceConfig.getCredential();
        var serviceCredsURL = serviceCreds.getURL();

        var baseApiUrl = (serviceCredsURL) && serviceHelpers.extractBaseUrl(serviceCredsURL);
        var apiPassword = serviceCreds.getPassword();

        var imageSizeFolder = 'large';
        var imageType = fullImageURL.substr(-4);
        var imageFileName = productId + imageType;
        var imageBasePath = catalogImageBasePath.slice(-1) === '/' ? catalogImageBasePath : catalogImageBasePath + '/';
        var CATALOG_PATH = '/' + catalogId + '/default' + imageBasePath + imageSizeFolder + '/';
        var destinationImageFolder = new File(CATALOG_BASE_PREFIX + CATALOG_PATH);
        var uploadedImagePath = null;

        if (!destinationImageFolder.exists()) {
            destinationImageFolder.mkdirs();
            logger.info('Destination catalog image folder was created...');
        }

        var destinationImageFile = new File(CATALOG_BASE_PREFIX + CATALOG_PATH + imageFileName);
        if (destinationImageFile.exists()) {
            destinationImageFile.remove();
        }
        var httpClient = new HTTPClient();

        httpClient.setRequestHeader('X-MercauxApikey', apiPassword);
        httpClient.open('GET', baseApiUrl + fullImageURL);

        httpClient.sendAndReceiveToFile(destinationImageFile);

        if (httpClient.statusCode === 200) {
            uploadedImagePath = imageSizeFolder + '/' + imageFileName;
        } else {
            logger.error('Error while calling saveLookImage() service, StatusCode: {0}', httpClient.statusCode);
        }
        logger.info('Image generation service called: URL: {0}, Status Code: {1}', baseApiUrl + fullImageURL, httpClient.statusCode);

        return uploadedImagePath;
    }
};

