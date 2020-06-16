/* eslint-disable no-undef */
'use strict';

var COMgr = require('dw/object/CustomObjectMgr');
var UUIDUtils = require('dw/util/UUIDUtils');
var collections = require('*/cartridge/scripts/util/collections');

/* Script Modules */
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

const OBJECT_TYPE = 'mercauxAnalytics';

/**
 * Controller for Add data to Analytic
 *
 * @module controllers/Analytics
 */
function add() {
    var Transaction = require('dw/system/Transaction');
    let r = require('*/cartridge/scripts/util/Response');
    var customObject;
    var params = request.httpParameterMap;
    var session = request.getSession();
    var customer = session.getCustomer();
    var dataJSON = {};

    if (params.requestBodyAsString) {
        try {
            dataJSON = JSON.parse(params.requestBodyAsString);    
        } catch (error) {
            r.renderJSON({
                success: false,
                error: error
            });
            return;
        }
    }

    if (!dataJSON.event) {
        r.renderJSON({
            success: false,
            emptyParams: true
        });
        return;
    }

    dataJSON.customer = customer.isAnonymous() ? 'Anonymous' : customer.getProfile().getCredentials().getLogin();
    var customObjects = COMgr.queryCustomObjects(OBJECT_TYPE, 'custom.mercauxAnalyticsUser={0} AND custom.readyForExport=false', 'custom.mercauxAnalyticsUser asc', customer.getID());

    if (customObjects.getCount() === 0) {
        Transaction.wrap(function () {
            customObject = COMgr.createCustomObject(OBJECT_TYPE, UUIDUtils.createUUID());
            customObject.custom.mercauxAnalyticsUser = customer.getID();
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

    r.renderJSON({
        success: true
    });
}

/** Analytics Controller
 * @see module:controllers/Analytics~Add */
exports.Add = guard.ensure(['post'], add);
exports.Add.public = true;
