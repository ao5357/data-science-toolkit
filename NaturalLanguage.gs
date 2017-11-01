/**
 * @file A processing suite for using the Google Cloud Natural Language API.
 *
 * @see https://cloud.google.com/natural-language/
 */

/**
 * Natural Language settings.
 */
function naturalLanguageSettings(serviceName) {
  var settings = {
    'concatStr': ' '
  };
  
  // Since Apps Script hates ES5 Object methods, we'll override the props manually for now.
  if (serviceSettings[serviceName].concatStr) {
    settings.concatStr = serviceSettings[serviceName].concatStr;
  }
  
  return settings;
}

/**
 * Processing function making an NLP call and bringing back data.
 */
function naturalLanguageProcessingFunction(row, serviceName) {
  var settings = naturalLanguageSettings(serviceName);
  var includes = getIncludes(serviceName);

  var NLPText = '', includeArr = [];
  includes.forEach(function(key){
    includeArr.push(row[0][key]);
  });
  NLPText = includeArr.join(settings.concatStr);
  
  var data = naturalLanguageCall(NLPText);
  
  row = mapToRow(row, serviceName, data);
  return row;
}

/**
 * Sub-processing function that takes NLP results and counts the number of people.
 *
 * Also saves the names of people into a list for further processing.
 *
 * @requires naturalLanguageProcessingFunction()
 * @used-by genderizeProcessingFunction()
 */
function naturalLanguagePeople(row, serviceName, parentService) {
  var data = {
    'people': 0,
    'names': []
  };
  var parentData = row[1][parentService];
  
  parentData.entities.forEach(function(entity){
    // Assess only people here.
    if (entity.type === 'PERSON') {
      data.people++;
      // Add the person's first name to the genderizer list.
      data.names.push(entity.name);
    }
  });
  
  row = mapToRow(row, serviceName, data);
  return row;
}

/**
 * Send some text to the Natural Language API and get analysis back.
 *
 * The three analyses are overall document sentiment, a broad category,
 * and entity extraction from the text.
 *
 * @arg String text
 * @return Object data
*/
function naturalLanguageCall(text) {
  // Set the NLP features to run.
  var features = {
    'extractEntities': true,
    'extractDocumentSentiment': true
  };
  if (text.split(' ').length > 20) {
    features.classifyText = true;
  }
  
  // Set up the payload for the request.
  var requestUrl = [
    'https://language.googleapis.com/v1beta2/documents:annotateText?key=',
    GoogleAPIKey
  ].join("");
  var data = {
    'document': {
      'language': 'en-us',
      'type': 'PLAIN_TEXT',
      'content': text
    },
    'features': features,
    'encodingType': 'UTF8'
  };
  
  // Make the request and turn it into vars.
  var options = {
    method : 'POST',
    contentType: 'application/json',
    payload : JSON.stringify(data)
  };
  var response = urlFetch(requestUrl, options);
  var data = JSON.parse(response);
  
  return data;
}
