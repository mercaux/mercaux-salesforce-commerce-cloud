var processInclude = require('base/util');

$(document).ready(function () {
    processInclude(require('./components/pageSize'));
    processInclude(require('./looksGallery'));
});
