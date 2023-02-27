'use strict';

var logger = require('dw/system/Logger').getLogger('Mercaux');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var File = require('dw/io/File');
var rest = require('~/cartridge/scripts/services/restDefinition');
var SERVICE_ID = 'int_mercaux_api_service';

/**
 * Constructs and configures a service with a callback.
 * @param {string} serviceID - Service ID
 * @param {Object} definition - service definition object
 * @returns {dw.svc.Service} -  return a call-specific configuration of Service.
 */
function createService(serviceID, definition) {
    return LocalServiceRegistry.createService(serviceID, definition);
}

module.exports = {
    getLooks: function (requestParams) {
        var service = createService(SERVICE_ID, rest.service.fetchAllLooks());
        var Result = service.call(requestParams || '');
        var resopnseObject;

        if (Result.ok) {
            responseObject = Result.getObject();
            responseObject.ok = true;
        } else {
            logger.error('Error when requesting looks from mercaux api: {0}', Result.getErrorMessage());
            responseObject = {ok: false, errorMsg: Result.getErrorMessage()};
        }
        return responseObject
    },

    saveLookImage: function (fullImageName, destinationFolder) {
        var service = createService(SERVICE_ID, rest.service.fetchLookImage());

        if (!destinationFolder.exists()) {
            destinationFolder.mkdirs();
            logger.info('Destination catalog image folder was created...');
        }

        var imageName = fullImageName.match(/[^\/]+$/);
        var destinationFile = new File(destinationFolder, imageName);
        if (destinationFile.exists()) {
            logger.info('Image file already exists: {0}', imageName);
            return imageName;
        }

        var Result = service.call({imageName: fullImageName, saveToFile: destinationFile});

        if (Result.isOk()) {
            return imageName;
        } else {
            logger.error('Error when downloading look image from mercaux api: {0}', Result.getErrorMessage());
            return null;
        }
    },
    filterLogMessage: function(msg) {
        return msg; // it's never passing sensitive data
    }
};

