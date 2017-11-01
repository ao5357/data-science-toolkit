/**
 * @file A processing suite for the Google Knowledge Graph Search API.
 *
 * @see https://developers.google.com/knowledge-graph/
 */

/**
 * Get detailed information about a Knowledge Graph entity (by ID).
 *
 * @arg String mid
 * @return object
 */
function knowledgeGraphMIDCall(mid) {
  var requestUrl = [
    'https://kgsearch.googleapis.com/v1/entities:search?key=',
    GoogleAPIKey,
    '&ids=',
    mid
  ].join("");
  var response = urlFetch(requestUrl);
  var responseObj = JSON.parse(response);
  return responseObj;
}
