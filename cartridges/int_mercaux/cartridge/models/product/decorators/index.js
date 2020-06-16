'use strict';

var isMercauxLook = require('*/cartridge/models/product/decorators/isMercauxLook');
var lookType = require('*/cartridge/models/product/decorators/lookType');
var likesCount = require('*/cartridge/models/product/decorators/likesCount');
var badges = require('*/cartridge/models/product/decorators/badges');
var slideImage = require('*/cartridge/models/product/decorators/slideImage');
var croppedImage = require('*/cartridge/models/product/decorators/croppedImage');
var sku = require('*/cartridge/models/product/decorators/sku');

module.exports = module.superModule;
module.exports.isMercauxLook = isMercauxLook;
module.exports.slideImage = slideImage;
module.exports.lookType = lookType;
module.exports.likesCount = likesCount;
module.exports.badges = badges;
module.exports.croppedImage = croppedImage;
module.exports.sku = sku;
