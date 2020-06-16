var processInclude = require('../util');

$(document).ready(function () {
    processInclude(require('./components/pageSize'));
    processInclude(require('./looksGallery'));
});
