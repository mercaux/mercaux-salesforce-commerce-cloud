'use strict';

var selectors = {
    sortMenuItem: '.js-sort-menu-item',
    refinementFilterItem: '.js-refinement-filter-item',
    refinementDesktopParent: '.js-refinement-desktop-parent',
    sortByParentMobile: '.looks-top-filters-wrapper-mobile .js-sortBy-parent-mobile',
    sortByParentDesktop: '.looks-top-filters-wrapper #looks-top-filters-sortBy'
};
var CURRENT_WINDOW_WIDTH = 0;
var BREAKPOINT_MOBILE = 1025;

// On Load/Resize to catch device width
$(window).on('load', onWindowChange);
$(window).resize(onWindowChange);


/**
 * Window Change Event listener
 */
function onWindowChange() {
    CURRENT_WINDOW_WIDTH = this.innerWidth;

    var INITIONAL_DEVICE = CURRENT_WINDOW_WIDTH > BREAKPOINT_MOBILE ? 'desktop' : 'mobile';
    var $sortParentMobile = $(selectors.sortByParentMobile);
    var $sortParentDesktop = $(selectors.sortByParentDesktop);

    if (INITIONAL_DEVICE === 'desktop') {
        if ($sortParentDesktop.find('.flex-item-ul').length !== 0) return;

        var sortByMobileHtml = $sortParentMobile.html();
        $sortParentDesktop.empty().html(sortByMobileHtml);
        $sortParentMobile.empty();
    } else {
        if ($sortParentMobile.find('.flex-item-ul').length !== 0) return;

        var sortByDesktopHtml = $sortParentDesktop.html();
        $sortParentMobile.empty().html(sortByDesktopHtml);
        $sortParentDesktop.empty();
    }

    $('body').on('change', '[name=sort-order]', function () {
        $('.looks-top-filters-sortBy input[type="radio"]').each(function () {
            $(this).removeAttr('checked');
        });

        $(this).attr('checked', true);
    });
}


$(document).ready(function () {
    var $refinementParentBlock = $(selectors.refinementDesktopParent);
    var countRefinementFilters = $refinementParentBlock.find('.refinement-desktop-item').length;
    if (countRefinementFilters < 2) {
        $refinementParentBlock.addClass('has-one-refinement');
    }
});
