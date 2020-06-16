'use strict';

var logger = require('dw/system/Logger').getLogger('Mercaux');
var File = require('dw/io/File');
/**
 * Deletes the specified files.
 *
 * @param {Array} fileList - An array of dw.io.File instances to delete
 */
function deleteFiles(fileList) {
    fileList.forEach(function (fileItem) {
        if (fileItem.directory) {
            logger.warn('Directory cannot be deleted: ' + fileItem.fullPath);
        } else {
            var result = fileItem.remove();
            if (result) {
                logger.debug('File has been deleted: ' + fileItem.fullPath);
            } else {
                logger.warn('File could not be deleted: ' + fileItem.fullPath);
            }
        }
    });
}

/**
 * Deletes the specified files.
 *
 * @param {dw.io.File} file - An file of dw.io.File instance that going to delete
 */
function deleteFile(file) {
    if (file.directory) {
        logger.warn('Directory cannot be deleted: ' + file.fullPath);
    } else {
        var result = file.remove();
        if (result) {
            logger.debug('File has been deleted: ' + file.fullPath);
        } else {
            logger.warn('File could not be deleted: ' + file.fullPath);
        }
    }
}

/**
 * Move files between directories
 *
 * @param {Array} sourceFilesList - An array of dw.io.File instances that going to move to another folder
 * @param {dw.io.File} targetFolder - Destination folder of dw.io.File where files should be move
 * @returns {Array} Array with Files that should be moved
 */
function moveFiles(sourceFilesList, targetFolder) {
    var copiedFiles = [];
    var inProgressFiles = targetFolder.listFiles().toArray();

    // Remove all files from inprogress folder
    deleteFiles(inProgressFiles);

    sourceFilesList.forEach(function (sourceFile) {
        if (sourceFile.directory) {
            logger.warn('Directory cannot be moved: ' + sourceFile.fullPath);
        } else {
            var targetFileName = sourceFile.getName();
            var targetFile = new File(targetFolder.fullPath + '/' + targetFileName);

            var copiedFile = sourceFile.copyTo(targetFile);
            if (copiedFile.file) {
                logger.debug('File has been moved: ' + copiedFile.fullPath);
                copiedFiles.push(copiedFile);
                deleteFile(sourceFile);
            }
        }
    });

    return copiedFiles;
}

module.exports = {
    deleteFiles: deleteFiles,
    moveFiles: moveFiles
};
