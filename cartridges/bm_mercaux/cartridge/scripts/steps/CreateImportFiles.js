/* eslint-disable block-scoped-var */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
'use strict';

var Status = require('dw/system/Status');
var logger = require('dw/system/Logger').getLogger('Mercaux');
var File = require('dw/io/File');

var ServiceMgr = require('~/cartridge/scripts/services/ServiceMgr');
var XMLUtils = require('~/cartridge/scripts/helpers/XMLUtils');
var FileUtils = require('~/cartridge/scripts/helpers/FileUtils');

var TEMP_FILE_PATH = 'file';
var TEMP_FILE_TYPE = '.xml';
var IMPEX_PATH_PREFIX = '/IMPEX/src';

/**
 * Generate XML catalog based on API response containing Looks products data
 *
 * @param {dw.util.HashMap} args job step arguments
 * @param {dw.job.JobStepExecution} jobStepExecution - job step execution obj
 * @returns {dw.system.Status} job status
 */
function execute(args, jobStepExecution) {
    var rootJobFolder = args.RootMercauxFolder;
    var catalogImageBasePath = args.CatalogImageBasePath;
    cleanSrcFolder(rootJobFolder);

    var partialResponse = false;
    var statusCode;
    var nextPagingHeader;
    var catalogID = args.CatalogID;
    var storefrontCatalogID = args.StorefrontCatalogID;
    var categoryID = args.CategoryID;

    // 1. Call first-time service request
    var initialRequest = fetchLooksAPI();
    logger.info('Start fetch looks data from Service API...');

    if (!initialRequest.ok) {
        var StatusCode = initialRequest.empty ? Status.OK : Status.ERROR;
        logger.error(initialRequest.errorMsg);
        return new Status(StatusCode, 'ERROR');
    }
    
    if (initialRequest.statusCode === 206) {
        partialResponse = true;
        nextPagingHeader = initialRequest.pagingData;
        statusCode = initialRequest.statusCode;
        logger.info('Partial response was returned from Service API...');
    }

    // create xml file based on first response
    var looksResultArr = initialRequest.data;
    var xmlCatalogStatus = createCatalogFile(catalogID, storefrontCatalogID, catalogImageBasePath, categoryID, rootJobFolder, looksResultArr);
    if (!xmlCatalogStatus.ok) {
        logger.error(xmlCatalogStatus.errorMsg);
        return new Status(Status.ERROR, 'ERROR');
    }
    logger.info('Catalog file was created...');

    while (partialResponse) {
        var nextLooksResult = fetchLooksAPI({ pagingHeader: nextPagingHeader });
        statusCode = nextLooksResult.statusCode;
        nextPagingHeader = nextLooksResult.pagingData;

        if (!nextLooksResult.ok) {
            if (nextLooksResult.empty) {
                return new Status(Status.OK, nextLooksResult.errorMsg);
            }

            logger.error(nextLooksResult.errorMsg);
            return new Status(Status.ERROR, nextLooksResult.errorMsg);
        }
        logger.info('Fetched next partial data of response from Service API...');

        // 2. Create Catalog Import File containing looks data
        var looksArray = nextLooksResult.data;
        var xmlCatalogStatus = createCatalogFile(catalogID, storefrontCatalogID, catalogImageBasePath, categoryID, rootJobFolder, looksArray);
        if (!xmlCatalogStatus.ok) {
            logger.error(xmlCatalogStatus.errorMsg);
            return new Status(Status.ERROR, xmlCatalogStatus.errorMsg);
        }
        logger.info('Catalog file from partial response was created...');

        if (statusCode !== 206 || !nextPagingHeader) {
            partialResponse = false;
            logger.info('End of request pagination, exited from creating catalog files...');
        }
    }

    return new Status(Status.OK, 'OK');
}

/**
 * Cleans SRC folder to remove old generated files
 *
 * @param {string} rootJobFolderPath - Path of root Mercaux job folder
 */
function cleanSrcFolder(rootJobFolderPath) {
    var srcFolder = new File(IMPEX_PATH_PREFIX + rootJobFolderPath + '/src');
    if (srcFolder.exists()) {
        var srcFiles = srcFolder.listFiles().toArray();
        if (srcFiles.length > 0) {
            FileUtils.deleteFiles(srcFiles);
            logger.info('Folder was cleaned, PATH: ' + rootJobFolderPath);
        }
    }
}

/**
 * Calls services to fetch Looks data from Mercaux API
 * @param {string} params - Object that contains params for apply paging data
 * @returns {Object} response object with Looks data
 */
function fetchLooksAPI(params) {
    var result = ServiceMgr.getLooks(params);
    var responseData = {
        ok: true,
        data: [],
        statusCode: 0,
        pagingData: '',
        errorMsg: '',
        empty: false
    };

    if (result.isError) {
        return { ok: false, errorMsg: 'Error with the service call' };
    }

    var looksArr = result.responseObj.data && result.responseObj.data.length > 0 ? result.responseObj.data : [];
    if (looksArr.length < 1 && result.statusCode === 200) {
        responseData.ok = false;
        responseData.empty = true;
        responseData.errorMsg = 'Response data is empty';
        return responseData;
    }

    responseData.pagingData = result.responseObj.pagingHeader || '';
    responseData.data = looksArr;
    responseData.statusCode = result.statusCode;

    return responseData;
}

/**
 * Create catalog XML file for import
 * @param {string} catalogId - Master catalog ID
 * @param {string} storefrontCatID - Storefront catalog ID
 * @param {string} catalogImageBasePath - Base Path of Image Settings of Catalog
 * @param {string} categoryId - Category ID that should be products assigned for
 * @param {string} filesPath - Path of root Mercaux job folder
 * @param {Array} looksDataArray - Array with looks product that fetched from API
 * @returns {Object} result object that used for Job status
 */
function createCatalogFile(catalogId, storefrontCatID, catalogImageBasePath, categoryId, filesPath, looksDataArray) {
    var resultObj = { ok: false, errorMsg: '' };

    if (!catalogId || catalogId === '') {
        resultObj.errorMsg = 'CatalogID parameter is empty';
        return resultObj;
    }

    var rootFolderResult = createFolderStructure(filesPath);
    if (!rootFolderResult.ok) {
        resultObj.errorMsg = rootFolderResult.errorMsg;
        return resultObj;
    }

    var catalogXMLFile = createImportFile(rootFolderResult.rootFolderFile, catalogId, storefrontCatID, catalogImageBasePath, categoryId, looksDataArray);

    if (!catalogXMLFile.ok) {
        resultObj.errorMsg = catalogXMLFile.errorMsg;
        return resultObj;
    }

    resultObj.ok = true;
    return resultObj;
}

/**
 * Creates folder structure for root Job Mercaux folder
 * @param {string} path - Path of root Mercaux job folder
 * @returns {Object} result object that used for Job status
 */
function createFolderStructure(path) {
    var rootImportFolder = new File(IMPEX_PATH_PREFIX + path);
    rootImportFolder.mkdirs();

    var rootMercauxFolder = rootImportFolder.fullPath;
    var targetFolders = ['src', 'archived'];

    targetFolders.forEach(function (folderName) {
        var childFolder = new File(rootMercauxFolder + '/' + folderName);
        if (!childFolder.exists()) childFolder.mkdir();
    });

    return { ok: true, rootFolderFile: new File(rootMercauxFolder) };
}

/**
 * Main parent function for creating Import XML File with all data
 * @param {string} rootMercauxFolder - Path of root Mercaux job folder
 * @param {string} catalogId - Master catalog ID
 * @param {string} storefrontCatID - Storefront catalog ID
 * @param {string} catalogImageBasePath - Base Path of Image Settings of Catalog
 * @param {string} categoryId - Category ID that should be products assigned for
 * @param {Array} looksDataArr - Array with looks product that fetched from API
 * @returns {Object} result object that used for Job status
 */
function createImportFile(rootMercauxFolder, catalogId, storefrontCatID, catalogImageBasePath, categoryId, looksDataArr) {
    var childDirectoriesObj = {};
    var result = { ok: true };
    var childDirecories = rootMercauxFolder.listFiles().toArray();

    childDirecories.forEach(function (directory) {
        childDirectoriesObj[directory.name] = directory;
    });

    var srcFolder = childDirectoriesObj.src;
    var productUtils = require('~/cartridge/scripts/helpers/productUtils');
    var productLooksResult = productUtils.searchProductsBySKU(looksDataArr, uploadImageService.bind(null, catalogId, catalogImageBasePath));

    if (productLooksResult.length > 0) {
        var productSetIDs = productLooksResult.map(function (productLookResult) { return productLookResult.product.id; });

        try {
            XMLUtils.catalogBaseXMLFile(catalogId, catalogImageBasePath, srcFolder, TEMP_FILE_PATH, TEMP_FILE_TYPE, function (xsw) {
                XMLUtils.addProductSetElements(xsw, productLooksResult, categoryId);
            });

            XMLUtils.catalogBaseXMLFile(storefrontCatID, catalogImageBasePath, srcFolder, TEMP_FILE_PATH, TEMP_FILE_TYPE, function (xsw) {
                XMLUtils.addProductAssigment(xsw, productSetIDs, categoryId);
            });
        } catch (e) {
            result.ok = false;
            result.errorMsg = 'Error processing file';
            logger.error('Error processing file: ' + e);
            return result;
        }
    } else {
        logger.error("Products with the SKUs from Response weren't found or manufacturerSKU search refinement attribute wasn't defined.");
    }

    return result;
}

/**
 * Uploads image from Mercaux API
 * @param {string} catalogId - Master catalog ID
 * @param {string} catalogImageBasePath - Base Path of Image Settings of Catalog
 * @param {string} fullImagePath - Path of root Mercaux job folder
 * @param {string} productId - Product ID of assigned image should be products assigned for
 * @returns {string} uploaded image path
 */
function uploadImageService(catalogId, catalogImageBasePath, fullImagePath, productId) {
    try {
        var result = ServiceMgr.saveLookImage(fullImagePath, productId, catalogId, catalogImageBasePath);
        return result;
    } catch (error) {
        logger.error('Error in uploading look image', error);
        throw Error(error);
    }
}

module.exports.execute = execute;
