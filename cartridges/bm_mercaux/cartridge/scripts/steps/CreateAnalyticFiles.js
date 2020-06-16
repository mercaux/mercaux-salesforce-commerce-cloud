'use strict';

var Status = require('dw/system/Status');
var logger = require('dw/system/Logger').getLogger('Mercaux');

var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var XMLStreamWriter = require('dw/io/XMLStreamWriter');
var Transaction = require('dw/system/Transaction');
var COMgr = require('dw/object/CustomObjectMgr');

const OBJECT_TYPE = 'mercauxAnalytics';

/**
 * Export Analytics data to XML:
 * @param {dw.util.HashMap} args - job arguments
 * @returns {dw.system.Status} return job status
 */
function execute(args) {
    if (args.disabled) return new Status(Status.OK, 'DISABLED');
    if (!args.outputFolder) return new Status(Status.ERROR, 'ERROR');

    var customObjects = COMgr.queryCustomObjects(OBJECT_TYPE, 'custom.readyForExport={0} AND custom.exported={1}', 'custom.mercauxAnalyticsUser asc', true, false);
    if (customObjects.getCount() === 0) {
        return new Status(Status.OK, 'NO_DATA_ANALYTICS_FOUND', 'NO DATA ANALYTICS FOUND');
    }

    var outputFolder = new File('/Impex/src' + args.outputFolder);
    outputFolder.mkdirs();

    var outputFile = new File(outputFolder.getFullPath() + '/analytics' + Date.now() + '.xml');
    var outputFileWriter;
    var outputXmlWriter;

    try {
        outputFileWriter = new FileWriter(outputFile);
        outputXmlWriter = new XMLStreamWriter(outputFileWriter);

        outputXmlWriter.writeStartDocument('UTF-8', '1.0');
        outputXmlWriter.writeStartElement('analytics');

        while (customObjects.hasNext()) {
            var customObject = customObjects.next();
            var objectDataList = customObject.custom.analyticsData.slice(0);
            objectDataList.forEach(function (strObject) {
                var object = JSON.parse(strObject);
                outputXmlWriter.writeStartElement('analytic-event');
                outputXmlWriter.writeStartElement('event-name');
                outputXmlWriter.writeCharacters(object.event);
                outputXmlWriter.writeEndElement();
                outputXmlWriter.writeStartElement('customer');
                outputXmlWriter.writeCharacters(object.customer);
                outputXmlWriter.writeEndElement();
                outputXmlWriter.writeStartElement('target');
                outputXmlWriter.writeCharacters(object.what);
                outputXmlWriter.writeEndElement();
                outputXmlWriter.writeStartElement('sorce');
                outputXmlWriter.writeStartElement('type');
                outputXmlWriter.writeCharacters(object.from.type);
                outputXmlWriter.writeEndElement();
                outputXmlWriter.writeStartElement('pid');
                outputXmlWriter.writeCharacters(object.from.pid);
                outputXmlWriter.writeEndElement();
                outputXmlWriter.writeEndElement();
                outputXmlWriter.writeStartElement('timestamp');
                outputXmlWriter.writeCharacters(object.when.timestamp);
                outputXmlWriter.writeEndElement();
                outputXmlWriter.writeEndElement();
            });

            Transaction.wrap(function () {
                customObject.custom.exported = true;
            });
        }

        outputXmlWriter.writeEndElement();
        outputXmlWriter.writeEndDocument();
        outputXmlWriter.flush();
    } catch (e) {
        logger.error('Error: \n' + e.stack);
        logger.error('Error: \n' + e.message);
        return new Status(Status.ERROR, 'ERROR');
    } finally {
        if (outputXmlWriter) outputXmlWriter.close();
        if (outputFileWriter) outputFileWriter.close();
        if (customObjects) customObjects.close();
    }
    return new Status(Status.OK, 'OK');
}

module.exports.execute = execute;
