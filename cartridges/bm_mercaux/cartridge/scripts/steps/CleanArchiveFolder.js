'use strict';

var Status = require('dw/system/Status');
var File = require('dw/io/File');
var FileUtils = require('~/cartridge/scripts/helpers/FileUtils');
var IMPEX_PATH_PREFIX = '/IMPEX/src';
var ARCHIVED_FOLDER_NAME = 'archived';

/**
 * Cleans archive folder with set up limit of collected .zip files
 * @param {dw.util.HashMap} args - job arguments
 * @returns {dw.system.Status} return job status
 */
function execute(args) {
    var rootMercauxFolder = args.RootMercauxFolder;
    var limitNumber = args.Number;
    var archivedFolder = new File(IMPEX_PATH_PREFIX + rootMercauxFolder + '/' + ARCHIVED_FOLDER_NAME);

    var files = archivedFolder.listFiles().toArray();
    if (files.length < 1) {
        return new Status(Status.OK, 'Directory is empty');
    }
    var filesWithDateDESC = files.map(function (file) {
        return { file: file, lastModifiedDate: file.lastModified() };
    })
    .sort(function (a, b) {
        var prevDate = a.lastModifiedDate;
        var nextDate = b.lastModifiedDate;
        if (prevDate < nextDate) return 1;
        if (prevDate > nextDate) return -1;
        return 0;
    });

    if (filesWithDateDESC.length <= limitNumber) {
        return new Status(Status.OK);
    }
    var filesToDelete = filesWithDateDESC.splice(limitNumber, filesWithDateDESC.length - limitNumber);
    if (filesToDelete.length > 0) {
        var resultFiles = filesToDelete.map(function (fileObj) {
            return fileObj.file;
        });
        FileUtils.deleteFiles(resultFiles);
    }
    return new Status(Status.OK, 'Files were successfully deleted.');
}

module.exports.execute = execute;
