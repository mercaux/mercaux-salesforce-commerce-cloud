/* eslint-disable guard-for-in */
'use strict';
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var XMLStreamWriter = require('dw/io/XMLStreamWriter');

/**
 * Set attribute to the element
 *
 * @param {dw.io.XMLStreamWriter} xsw - XMLStreamWriter of file
 * @param {Object} objAttr - Attribute object that going to applied to the element
 */
function setAttrsToElement(xsw, objAttr) {
    // eslint-disable-next-line no-restricted-syntax
    for (var key in objAttr) {
        xsw.writeAttribute(key, objAttr[key]);
    }
}

/**
 * Add single XML tag element of XML file
 *
 * @param {dw.io.XMLStreamWriter} xsw - XMLStreamWriter of file
 * @param {dw.io.XMLStreamWriter} elementName - Name of XML tag in the file
 * @param {string} content - Content that should be insert
 * @param {Object} attrs - Attribute object that going to applied to the element
 * @param {boolean} isEmpty - Is Empty element or not
 */
function addSingleElement(xsw, elementName, content, attrs, isEmpty) {
    if (isEmpty) {
        xsw.writeEmptyElement(elementName);
        if (attrs) setAttrsToElement(xsw, attrs);
    } else {
        xsw.writeStartElement(elementName);
        if (attrs) setAttrsToElement(xsw, attrs);
        if (content) xsw.writeCharacters(content);
        xsw.writeEndElement();
    }
}

/**
 * Generate product set definitions in the XML file
 *
 * @param {dw.io.XMLStreamWriter} xsw - XMLStreamWriter of file
 * @param {Array} data - Data of product sets that should be contain in XML file
 * @param {string} categoryID - Category ID that should be product assigned for
 */
function addProductSetElements(xsw, data, categoryID) {
    var xlangAttr = {
        'xml:lang': 'x-default'
    };

    for (var i = 0; i < data.length; i++) {
        var productSetDataObj = data[i];
        var product = productSetDataObj.product;
        var badgesNames = productSetDataObj.badgesNames;
        var assignedProductsIDs = productSetDataObj.productsOfSet;
        var uploadedImagePath = productSetDataObj.uploadedImagePath;

        xsw.writeStartElement('product');
        setAttrsToElement(xsw, { 'product-id': product.id });
        addSingleElement(xsw, 'ean', null, null, true);
        addSingleElement(xsw, 'upc', null, null, true);
        addSingleElement(xsw, 'unit', null, null, true);
        addSingleElement(xsw, 'min-order-quantity', '1');
        addSingleElement(xsw, 'step-quantity', '1');
        addSingleElement(xsw, 'display-name', product.name, xlangAttr);
        addSingleElement(xsw, 'short-description', null, xlangAttr, true);
        addSingleElement(xsw, 'long-description', null, xlangAttr, true);
        addSingleElement(xsw, 'store-force-price-flag', 'false');
        addSingleElement(xsw, 'store-non-inventory-flag', 'false');
        addSingleElement(xsw, 'store-non-revenue-flag', 'false');
        addSingleElement(xsw, 'store-non-discountable-flag', 'false');
        addSingleElement(xsw, 'online-flag', 'true');
        addSingleElement(xsw, 'available-flag', 'true');
        addSingleElement(xsw, 'searchable-flag', 'true');

        if (uploadedImagePath) {
            xsw.writeStartElement('images');

            xsw.writeStartElement('image-group');
            setAttrsToElement(xsw, { 'view-type': 'large' });
            addSingleElement(xsw, 'image', null, { path: uploadedImagePath });
            xsw.writeEndElement(); // image-group

            xsw.writeStartElement('image-group');
            setAttrsToElement(xsw, { 'view-type': 'medium' });
            addSingleElement(xsw, 'image', null, { path: uploadedImagePath });
            xsw.writeEndElement(); // image-group

            xsw.writeStartElement('image-group');
            setAttrsToElement(xsw, { 'view-type': 'small' });
            addSingleElement(xsw, 'image', null, { path: uploadedImagePath });
            xsw.writeEndElement(); // image-group

            xsw.writeEndElement(); // images
        }

        addSingleElement(xsw, 'page-attributes', null, null, true);

        xsw.writeStartElement('custom-attributes');
        addSingleElement(xsw, 'custom-attribute', 'true', { 'attribute-id': 'isMercauxLook' });
        addSingleElement(xsw, 'custom-attribute', '' + product.likesCount + '', { 'attribute-id': 'likesCount' });
        if (product.lookType) {
            addSingleElement(xsw, 'custom-attribute', product.lookType, { 'attribute-id': 'lookType' });
        }
        if (product.badges && badgesNames.length > 0) {
            xsw.writeStartElement('custom-attribute');
            setAttrsToElement(xsw, { 'attribute-id': 'badges' });
            badgesNames.forEach(function (badgeName) {
                addSingleElement(xsw, 'value', badgeName);
            });
            xsw.writeEndElement(); // custom-attribute badges
        }
        xsw.writeEndElement(); // custom-attributes

        xsw.writeStartElement('product-set-products');
        assignedProductsIDs.forEach(function (productId) {
            addSingleElement(xsw, 'product-set-product', null, { 'product-id': productId });
        });
        xsw.writeEndElement(); // product-set-products

        addSingleElement(xsw, 'classification-category', categoryID);
        addSingleElement(xsw, 'pinterest-enabled-flag', 'false');
        addSingleElement(xsw, 'facebook-enabled-flag', 'false');

        xsw.writeStartElement('store-attributes');
        addSingleElement(xsw, 'force-price-flag', 'false');
        addSingleElement(xsw, 'non-inventory-flag', 'false');
        addSingleElement(xsw, 'non-revenue-flag', 'false');
        addSingleElement(xsw, 'non-discountable-flag', 'false');
        xsw.writeEndElement(); // product-set-products

        xsw.writeEndElement(); // product
    }
}

/**
 * Provide definition of product assigment to the Category
 *
 * @param {dw.io.XMLStreamWriter} xsw - XMLStreamWriter of file
 * @param {Array} productSetIDs - product Set IDs that should be assigned
 * @param {string} categoryID - Category ID that should be product assigned for
 */
function addProductAssigment(xsw, productSetIDs, categoryID) {
    for (var i = 0; i < productSetIDs.length; i++) {
        var id = productSetIDs[i];

        xsw.writeStartElement('category-assignment');
        setAttrsToElement(xsw, { 'category-id': categoryID });
        setAttrsToElement(xsw, { 'product-id': id });

        addSingleElement(xsw, 'primary-flag', 'true');

        xsw.writeEndElement(); // category-assignment
    }
}

/**
 * Main function to create catalog XML file
 * @param {string} catalogId - storefront catalog ID
 * @param {string} catalogImageBasePath - Image base page of Catalog Image settings
 * @param {dw.io.File} srcFolder - Src folder object
 * @param {string} TEMP_FILE_PATH - Tail name of file
 * @param {string} TEMP_FILE_TYPE - Type of file
 * @param {function} innerXMLBody - Callback that contain data of body XML file
 */
function catalogBaseXMLFile(catalogId, catalogImageBasePath, srcFolder, TEMP_FILE_PATH, TEMP_FILE_TYPE, innerXMLBody) {
    var xsw;
    var fileWriter;
    try {
        var timestamp = '_' + Date.now();
        var srcFilePath = srcFolder.fullPath + '/' + TEMP_FILE_PATH + timestamp + TEMP_FILE_TYPE;
        var fullPathXMLfile = new File(srcFilePath);
        fileWriter = new FileWriter(fullPathXMLfile);
        xsw = new XMLStreamWriter(fileWriter);

        var attrCatalogElement = {
            xmlns: 'http://www.demandware.com/xml/impex/catalog/2006-10-31',
            'catalog-id': catalogId
        };

        xsw.writeStartDocument('UTF-8', '1.0');
        xsw.writeStartElement('catalog');
        setAttrsToElement(xsw, attrCatalogElement);

        xsw.writeStartElement('header');
        xsw.writeStartElement('image-settings');
        addSingleElement(xsw, 'internal-location', null, { 'base-path': catalogImageBasePath }, true);

        xsw.writeStartElement('view-types');
        addSingleElement(xsw, 'view-type', 'large', null, false);
        addSingleElement(xsw, 'view-type', 'medium', null, false);
        addSingleElement(xsw, 'view-type', 'small', null, false);
        addSingleElement(xsw, 'view-type', 'swatch', null, false);
        addSingleElement(xsw, 'view-type', 'hi-res', null, false);
        xsw.writeEndElement(); // view-types

        addSingleElement(xsw, 'variation-attribute-id', 'color', null, false);
        addSingleElement(xsw, 'alt-pattern', '${productname}, ${variationvalue}, ${viewtype}', null, false);
        addSingleElement(xsw, 'title-pattern', '${productname}, ${variationvalue}', null, false);

        xsw.writeEndElement(); // image-settings
        xsw.writeEndElement(); // header

        innerXMLBody(xsw);

        xsw.writeEndElement(); // catalog
        xsw.writeEndDocument();
    } catch (error) {
        throw new Error(error);
    } finally {
        if (xsw) xsw.close();
        if (fileWriter) fileWriter.close();
    }
}

module.exports = {
    addProductSetElements: addProductSetElements,
    setAttrsToElement: setAttrsToElement,
    addSingleElement: addSingleElement,
    catalogBaseXMLFile: catalogBaseXMLFile,
    addProductAssigment: addProductAssigment
};
