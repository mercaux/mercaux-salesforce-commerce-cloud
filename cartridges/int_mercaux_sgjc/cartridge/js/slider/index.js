'use strict';

var initOwlCarousel = require('./owlCarousel');
var getProductSet = require('./getProductSet');
var initModal = require('./modal');


module.exports = function () {
    initOwlCarousel();
    getProductSet();
    initModal();
};
