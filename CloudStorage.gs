/**
 * @file An input function to get data from Cloud Storage.
 *
 * @see https://cloud.google.com/storage/docs/
 */

/**
 * Cloud Storage settings.
 */
function cloudStorageSettings(serviceName) {
  var settings = {
    'url': 'https://storage.googleapis.com/data-science-toolkit/uci-news-aggregator.csv'
  };
  
  return settings;
}

/**
 * Plug in one of the input functions.
 *
 * @arg Array rows -- the input rows
 * @arg String serviceName -- A name to use to distinguish this from other services being run.
 * @return array rows -- the output rows, potentially modified.
 */
function cloudStorageInputFunction(serviceName) {
  var settings = cloudStorageSettings();
  
  rows = cloudStorageCall(settings.url);
  rows.forEach(function(raw){
    var data = {
      'headline': raw[1],
      'url': raw[2],
      'source': raw[3],
      'publishedAt': raw[7],
      'meta': raw
    };        
    
    var row = makeRow(); // Create a row.
    row = mapToRow(row, serviceName, data); // Put basic article metadata in a row.
 
    processingHandler(row); // Call the processingHandler
  });
}

/**
 * Get news data from the news API.
 */
function cloudStorageCall(url) {
  var response = urlFetch(url);
  return Utilities.parseCsv(response);
}
