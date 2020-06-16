'use strict';

var selectors = {
    pageSizeSelect: '.js-change-page-size'
};

$(document).ready(function () {
    $('body').on('change', selectors.pageSizeSelect, function () {
        var origin = window.location.origin;
        var pathname = window.location.pathname;

        var baseUrl = origin + pathname;
        var pageSizeValue = this.value;

        window.location.href = baseUrl + '?sz=' + pageSizeValue;
    });
});
