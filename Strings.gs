/**
 * @file A processing suite for strings.
 */

/**
 * String settings.
 */
function stringsSettings(serviceName) {
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
 * Processing function that counts substrings in a larger text.
 */
function stringsProcessingFunction(row, serviceName, strings) {
  var settings = stringsSettings(serviceName);
  var includes = getIncludes(serviceName);
  var data = {
    'count': 0
  }, text = '', includeArr = [];
  
  includes.forEach(function(key){
    includeArr.push(row[0][key]);
  });
  text = includeArr.join(settings.concatStr);
    
  strings.forEach(function(thisString){
    data.count += occurrences(text, thisString);
  });
    
  row = mapToRow(row, serviceName, data);
  return row;
}

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}
