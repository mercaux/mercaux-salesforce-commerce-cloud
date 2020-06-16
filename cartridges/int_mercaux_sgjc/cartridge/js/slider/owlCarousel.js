/* eslint-disable camelcase */
'use strict';

/**
 * Init client-side JS code
 */
function init() {
    $(document).ready(function () {
        var owlMercaux = $('.owl-carousel');
        owlMercaux.owlCarousel({
            loop: false,
            margin: 65,
            nav: true,
            dots: false,
            mouseDrag: false,
            touchDrag: false,
            onInitialized: onOwlLoaded,
            responsive: {
                0: {
                    items: 1,
                    touchDrag: true,
                    nav: true
                },
                600: {
                    items: 3,
                    touchDrag: true,
                    nav: true
                },
                1000: {
                    items: 3
                }
            }
        });

        /**
         * OnLoad slider callback
         * @param {Event} owlEvent event of loaded slider object
         */
        function onOwlLoaded(owlEvent) {
            var $sliderBlock = $(owlEvent.target).parents('body').find('#SliderLooksCarousel');
            if ($sliderBlock.length > 0) {
                trigger_LookDisplayedInPage_event($sliderBlock);
            }
        }

        insertShopTheLookBtn();
    });
}

/**
 *  Logic to handle insert Shop The Look btn on the PDP
 */
function insertShopTheLookBtn() {
    var selectors = {
        sliderID: '#SliderLooksCarousel',
        blockButton: '.js-insert-shop-the-look-btn'
    };
    var isSliderOnPage = $(selectors.sliderID).length > 0;
    var $destinationBtnBlock = $(selectors.blockButton);

    if (!isSliderOnPage || $destinationBtnBlock.length < 1) {
        $(selectors.blockButton).remove();
    }

    $('body').on('click', selectors.blockButton, function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $(selectors.sliderID).offset().top
        }, 1000);
    });

    if (isSliderOnPage) {
        $(document).on('scroll', function () {
            handleShopTheLookBtn(selectors);
        });

        handleShopTheLookBtn(selectors);
    }
}

/**
 *  Logic for trigger analytic event
 *  @param {jQuery} $sliderBlock slider block selector
 */
function trigger_LookDisplayedInPage_event($sliderBlock) {
    var slideItems = $sliderBlock.find('.js-look-item');
    var looksIDs = [];

    slideItems.each(function () {
        var pid = $(this).attr('data-pid');
        looksIDs.push(pid);
    });

    $('body').trigger('analyticsMercaux:LookDisplayedInPage', { looksIDs: looksIDs });
}

/**
 *  Handle floating shop the look btn
 *  @param {Object} selectors object with names of selector classNames and IDs
 */
function handleShopTheLookBtn(selectors) {
    if (window.innerWidth > 568) {
        return;
    }

    var sliderOffset = $(selectors.sliderID).offset().top;
    var windowOffset = window.pageYOffset;

    if (windowOffset + 500 > sliderOffset) {
        $(selectors.blockButton).hide();
    } else {
        $(selectors.blockButton).show();
    }
}

module.exports = init;
