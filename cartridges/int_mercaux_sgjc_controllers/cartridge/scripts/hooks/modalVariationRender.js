'use strict';

/**
 * Contains logic to render variation template in modal, after some variation was selected
 * @param {Object} args - Object with variation data
 * @returns {boolean} - Result of execution of hook
 */
function renderVariationInModal(args) {
    const { params, app, product, resetAttributes, currentVariationModel } = args;
    let isHooksExecuted = false;
    let isMercauxLook = params.mercauxModal.booleanValue;

    if (isMercauxLook) {
        isHooksExecuted = true;
        app.getView('Product', {
            product: product,
            GetImages: true,
            resetAttributes: resetAttributes,
            CurrentVariationModel: currentVariationModel
        }).render('modal/product/childProductContent');
    }
    return isHooksExecuted;
}

module.exports.renderVariationInModal = renderVariationInModal;
