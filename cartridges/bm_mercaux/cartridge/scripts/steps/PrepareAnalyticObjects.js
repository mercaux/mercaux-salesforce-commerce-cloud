'use strict';

var Status = require('dw/system/Status');
var Transaction = require('dw/system/Transaction');
var COMgr = require('dw/object/CustomObjectMgr');

const OBJECT_TYPE = 'mercauxAnalytics';

/**
 * Prepare analytic objects
 * @returns {dw.system.Status} job status
 */
function execute() {
    var customObjects = COMgr.queryCustomObjects(OBJECT_TYPE, 'custom.readyForExport={0}', 'custom.mercauxAnalyticsUser asc', false);

    while (customObjects.hasNext()) {
        Transaction.wrap(function () {
            var customObject = customObjects.next();
            customObject.custom.readyForExport = true;
        });
    }
    customObjects.close();

    return new Status(Status.OK, 'Objects were successfully prepared.');
}

module.exports.execute = execute;
