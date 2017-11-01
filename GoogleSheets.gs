/**
 * @file Primary Output handler -- saving rows to a Google Spreadsheet.
 *
 * @see https://developers.google.com/apps-script/reference/spreadsheet/
 */

/**
 * Protected global for the sheet to write to.
 */
var googleSheet = null;

/**
 * Google Sheets settings.
 */
function googleSheetsSettings() {
  var settings = {
    'addToExisting': false, // Add to an existing sheet or create a new sheet.
    'sheetPrefix': 'newsSentimentList', // Name/prefix for sheet.
    'folderName': 'newsSentiment' // Folder name for saving sheets.
  };
  
  return settings;
}

/**
 * Output function for Google Sheets.
 *
 * @arg Array writeRows -- The rows of the spreadsheet
 * @arg String serviceName -- A name to use to distinguish this from other services being run.
 * @see Globals.gs 
 */
function googleSheetsOutputFunction(writeRow, serviceName) {
  googleSheet.appendRow(writeRow); // Insert the row into the spreadsheet.
  
  return writeRow;
}

/**
 * Initializer for Google Sheets.
 */
function googleSheetsInitializer() {
  var settings = googleSheetsSettings();
  var folder = googleSheetsFolder(settings.folderName); // Get the folder for the sheet(s).
  googleSheet = googleSheetsOutputSheet(folder); // Get the spreadsheet for holding the results.
}

/**
 * Get a folder of the desired name, or create one.
 */
function googleSheetsFolder(thisFolderName) {
  var folders = DriveApp.getFoldersByName(thisFolderName);
  
  if (folders.hasNext()) {
    var thisFolder = folders.next();
  }
  else {
    var thisFolder = DriveApp.createFolder(thisFolderName);
  }
  
  return thisFolder;
}

/**
 * Get either the existing sheet (or create if it doesn't exist), or make a new sheet.
 */
function googleSheetsOutputSheet(folder) {
  var settings = googleSheetsSettings();
  
  // Get a folder, just in case.
  if (!folder) {
    var folder = googleSheetsFolder(settings.folderName);
  }
  
  if (settings.addToExisting) {
    // If we appending rows to an existing sheet.
    var sheets = folder.getFilesByName(settings.sheetPrefix);
    if (sheets.hasNext()) {
      // If the sheet already exists.
      var thisSheet = sheets.next();
      thisSheet = SpreadsheetApp.open(thisSheet);
    }
    else {
      // Otherwise we have to make a new sheet.
      var thisSheet = SpreadsheetApp.create(settings.sheetPrefix);
      googleSheetsPrep(thisSheet);
      var thisPointer = DriveApp.getFileById(thisSheet.getId());
      folder.addFile(thisPointer);
      DriveApp.getRootFolder().removeFile(thisPointer);
    }
  }
  else {
    // If we're making a new sheet every time.
    var now =new Date();
    var thisSheet = SpreadsheetApp.create(settings.sheetPrefix + now.getTime());
    googleSheetsPrep(thisSheet);
    var thisPointer = DriveApp.getFileById(thisSheet.getId());
    folder.addFile(thisPointer);
    DriveApp.getRootFolder().removeFile(thisPointer);
  }
  
  return thisSheet;
}

/**
 * Prep the sheet and columns with fanciness.
 *
 * @requires global rowSchema
 */
function googleSheetsPrep(sheet) {
  // Make the sheet Lato font.
  sheet.getRange('A1:O').setFontFamily('Lato');
  
  // Set a frozen header row.
  var columnNames = [],
    columnCodes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA', 'AB']; // Extend if needed.
  rowSchema.forEach(function(column, i){
    if (column.name) {
      columnNames.push(column.name);
    }
    else {
      columnNames.push(i);
    }
  });
  sheet.appendRow(columnNames);
  sheet.setFrozenRows(1);
  sheet.getRange('A1:' + columnCodes[(rowSchema.length - 1)] + '1').setFontWeight('bold');

  // @todo Get the conditional formatting working.
}

/**
 * Add conditional formatting to Number columns.
 *
 * @todo UNUSED
 */
function googleSheetsConditionalFormatting() {
  // Add conditional formatting per column.
  var spreadsheetId = sheet.getId();
  sheet = sheet.getActiveSheet();
  var sheetId = sheet.getSheetId();
  
  var format_req = {
    "requests": [{
      'addConditionalFormatRule': googleSheetsCondWizard(sheetId, 6, 7, 0),
      'addConditionalFormatRule': googleSheetsCondWizard(sheetId, 7, 8, 1),
      'addConditionalFormatRule': googleSheetsCondWizard(sheetId, 9, 10, 2),
      'addConditionalFormatRule': googleSheetsCondWizard(sheetId, 10, 11, 3),
      'addConditionalFormatRule': googleSheetsCondWizard(sheetId, 11, 12, 4),
      'addConditionalFormatRule': googleSheetsCondWizard(sheetId, 12, 13, 5)
    }],
    "includeSpreadsheetInResponse": false
  };

  Sheets.Spreadsheets.batchUpdate(JSON.stringify(format_req), spreadsheetId);
}

/**
 * Helper function to keep conditional formatting terse.
 *
 * @todo UNUSED
 */
function googleSheetsCondWizard(sheetId, sCI, eCI, xindex) {
  return {
    "rule": {
      "ranges": [{
          "sheetId": sheetId,
          "startColumnIndex": sCI,
          "endColumnIndex": eCI,
          'startRowIndex': 1
      }],
      "gradientRule": {
        "minpoint": {
          'type': 'MIN',
          'color': {
            "red": 244/255,
            "green": 199/255,
            "blue": 195/255,
            "alpha": 1
          }
        },
        "maxpoint": {
          'type': 'MAX',
          'color': {
            "red": 183/255,
            "green": 225/255,
            "blue": 205/255,
            "alpha": 1
          }
        }
      }
    },
    "index": xindex
  };
}
