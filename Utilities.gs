/**
 * @file Helper functions and utilities.
 */

/**
 * Utility for processing functions to know which columns are included when concatenated.
 */
function getIncludes(serviceName) {
  var includes = [];
  
  rowSchema.forEach(function(column, i){
    if (column.settings[serviceName] && column.settings[serviceName].include) {
      includes.push(i);
    }
  });
  
  return includes;
}

/**
 * Utility to make a row from the schema.
 */
function makeRow() {
  var row = [[],{}];
  
  rowSchema.forEach(function(column){
    row[0].push(column.defaultval);
  });
  
  return row;
}

/**
 * Utility to map row values so we don't have to configure each function manually.
 */
function mapToRow(row, serviceName, data) {
  rowSchema.forEach(function(column, i){
    if (column.mapping[serviceName]) {
      var accessor = data;
      column.mapping[serviceName].forEach(function(key){
        if (accessor[key]) {
          accessor = accessor[key];
        }
        else {
          accessor = false;
        }
      });
      
      if (accessor) {
        row[0][i] = accessor;
      }
    }
  });
  
  row[1][serviceName] = data; // Attach the data object to cleanup object.
  return row;
}

/**
 * A quieter version of UrlFetchApp.fetch().
 *
 * @see https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app
 *
 * @arg String url
 * @arg Object params
 * @return String
 */
function urlFetch(url, params) {
  if (!params) {
    params = {
      method: 'GET',
      muteHttpExceptions: true
    };
  }
  else {
    params.muteHttpExceptions = true;
  }
  
  var returnval = '{}';
  var response = UrlFetchApp.fetch(url, params);
  if (response.getResponseCode() === 200) {
    returnval = response;
  }
  
  return returnval;
}
