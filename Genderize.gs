/**
 * @file A processing suite for the Genderize API.
 *
 * @see https://genderize.io/
 */

/**
 * Sub-processing function that takes names from a parent service and returns gender data.
 *
 * @requires parentService (with data.names)
 */
function genderizeProcessingFunction(row, serviceName, parentService) {
  var data = {
    'female': 0,
    'male': 0,
    'meta': []
  };
  
  // Get a list of names from the parent service.
  var parentData = row[1][parentService];
  if (parentData.names.length) {
    var genders = genderizeCall(parentData.names);
    data.meta = genders;
  }
  
  if (data.meta && data.meta.length) {
    data.meta.forEach(function(name){
      if (name.gender) {
        if (name.gender === 'male') {
          data.male++;
        }
        else if (name.gender === 'female') {
          data.female++;
        }
      }
    });
  }
  
  row = mapToRow(row, serviceName, data);
  return row;
}

/**
 * Call the API with one or more names.
 *
 * @arg Array names
 * @return Object
 */
function genderizeCall(names) {
  var requestUrl = [
    'https://api.genderize.io/?name[0]=',
    names[0].split(' ')[0]
  ].join('');
  
  if (names.length >= 2) {
    for (var i = 1; i < names.length; i++) {
      requestUrl += '&name[' + i + ']=' + names[i].split(' ')[0];
    }
  }
  
  var response = urlFetch(requestUrl);
  var data = JSON.parse(response);
  return data;
}
