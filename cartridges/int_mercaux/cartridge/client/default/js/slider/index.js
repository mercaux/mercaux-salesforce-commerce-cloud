'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('./owlCarousel'));
    processInclude(require('./getProductSet'));
    processInclude(require('./modal'));
});
