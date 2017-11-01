/**
 * @file A cleanup function using Google Apps Script native logging.
 *
 * @see https://developers.google.com/apps-script/reference/base/logger
 */

/**
 * Logger cleanup function.
 *
 * @arg Array rows -- the input rows
 * @arg String serviceName -- A name to use to distinguish this from other services being run.
 * @return Array rows -- the output rows, potentially modified.
 */
function loggerCleanupFunction(row, serviceName) {
  Logger.log(row[1]); // row[1] contains debugging information.
  
  return row; // Return row for consistency.
}
