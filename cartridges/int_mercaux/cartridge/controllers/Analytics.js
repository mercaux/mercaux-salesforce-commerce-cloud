'use strict';

var server = require('server');
var COMgr = require('dw/object/CustomObjectMgr');
var UUIDUtils = require('dw/util/UUIDUtils');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

var OBJECT_TYPE = 'mercauxAnalytics';

server.post('Add', consentTracking.consent, csrfProtection.validateAjaxRequest, function (req, res, next) {
    var Transaction = require('dw/system/Transaction');
    var customObject;
    var dataJSON = JSON.parse(req.form.data);
    dataJSON.customer = req.currentCustomer.raw.isAnonymous() ? 'Anonymous' : req.currentCustomer.raw.profile.credentials.login;
    var customObjects = COMgr.queryCustomObjects(OBJECT_TYPE, 'custom.mercauxAnalyticsUser={0} AND custom.readyForExport=false', 'custom.mercauxAnalyticsUser asc', req.currentCustomer.raw.ID);

    if (customObjects.getCount() === 0) {
        Transaction.wrap(function () {
            customObject = COMgr.createCustomObject(OBJECT_TYPE, UUIDUtils.createUUID());
            customObject.custom.mercauxAnalyticsUser = req.currentCustomer.raw.ID;
            customObject.custom.readyForExport = false;
            customObject.custom.exported = false;
        });
    } else {
        customObject = customObjects.first();
    }
    customObjects.close();

    var currentData = customObject.custom.analyticsData !== undefined ? customObject.custom.analyticsData.slice(0) : [];
    currentData.push(JSON.stringify(dataJSON));

    Transaction.wrap(function () {
        customObject.custom.analyticsData = currentData;
    });

    res.json({
        success: true
    });

    next();
});

module.exports = server.exports();
