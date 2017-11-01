/**
 * @file An input function to get data from the News API.
 *
 * @see https://newsapi.org/
 */

/**
 * News API settings.
 */
function newsAPISettings() {
  var settings = {
    'key': 'xxxxxxxxxxxxxxxxxxxxxxxx', // News API key.
    'publications': [ // List of sources from News API (@see: https://newsapi.org/sources ).
      'al-jazeera-english',
      'associated-press',
      'breitbart-news',
      'cnn',
      'entertainment-weekly',
      'newsweek',
      'reuters',
      'the-huffington-post',
      'the-new-york-times',
      'the-wall-street-journal',
      'the-washington-post',
      'time',
      'usa-today'
    ]
  };
  
  // settings.publications = ['associated-press']; // Override full list for testing (comment this line in production).
  
  return settings;
}

/**
 * Plug in one of the input functions.
 *
 * @arg Array rows -- the input rows
 * @arg String serviceName -- A name to use to distinguish this from other services being run.
 * @return array rows -- the output rows, potentially modified.
 */
function newsAPIInputFunction(serviceName) {
  var settings = newsAPISettings();
  
    // Iterate over the publications and do stuff per pub.
  settings.publications.forEach(function(publication){
    var news = newsAPICall(publication, settings.key); // Get the news from the external source.
    
    if (news && news.status === 'ok') {
      news.articles.forEach(function(article){
        article.publication = publication; // Make the publication available within the input.
        
        var row = makeRow(); // Create a row.
        row = mapToRow(row, serviceName, article); // Put basic article metadata in a row.
 
        processingHandler(row); // Call the processingHandler
      });
    }
  });
}

/**
 * Get news data from the news API.
 */
function newsAPICall(publication, key) {
  var newsUrl = "https://newsapi.org/v1/articles?source=" + publication + "&apiKey=" + key;
  var newsResponse = urlFetch(newsUrl);
  var newsObj = JSON.parse(newsResponse);
  return newsObj;
}
