'use strict';

/**
 * Contains logic to render variation template in parent modal popup, after some size of dropdown was selected
 * @param {Object} args - Object with variation data
 * @returns {boolean} - Result of execution of hook
 */
function renderVariationInParentModal(args) {
    const { product, CurrentVariationModel, isSet, params, app } = args;
    let isHooksExecuted = false;
    let isMercauxModalTileLook = params.mercauxTileModal.booleanValue;
    let parentLookID = params.parentLookID.value;

    if (isMercauxModalTileLook) {
        isHooksExecuted = true;
        app.getView('Product', {
            product: product,
            isSet: isSet,
            parentLookID: parentLookID,
            isMaster: product.object.master,
            isVariationSelected: true,
            CurrentVariationModel: CurrentVariationModel
        }).render('modal/productTileLookItem');
    }
    return isHooksExecuted;
}

module.exports.renderVariationInParentModal = renderVariationInParentModal;
