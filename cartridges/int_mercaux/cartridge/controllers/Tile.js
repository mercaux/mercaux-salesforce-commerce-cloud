var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');
var Site = require('dw/system/Site');

server.extend(module.superModule);
var LOOKS_CAT_ID = Site.current.getCustomPreferenceValue('mercaux_CategoryID') || 'Looks';

server.append('Show', cache.applyPromotionSensitiveCache, function (req, res, next) {
    var categoryID = req.querystring.cgid;

    if (categoryID && categoryID === LOOKS_CAT_ID) {
        res.render('product/lookSet/gridTile.isml');
    }
    next();
}, pageMetaData.computedPageMetaData);


module.exports = server.exports();
