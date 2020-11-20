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
    var customObjects = COMgr.queryCustomObjects(OBJECT_TYPE, 'custom.exported={0}', 'custom.mercauxAnalyticsUser asc', true);

    while (customObjects.hasNext()) {
        Transaction.wrap(function () {
            COMgr.remove(customObjects.next())
        });
    }
    customObjects.close();

    return new Status(Status.OK, 'Exported objects were successfully deleted.');
}

module.exports.execute = execute;
