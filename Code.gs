/**
 * @file Main execution of the toolkit.
 */

/**
 * The specification of your output data.
 *
 * @prop String name
 * @prop String type ('Object', 'Number', 'String', 'Boolean', 'Null', 'Undefined')
 * @prop Mixed defaultval
 * @prop Object mapping -- One or more 'key': ['value'] pairs, where key is the serviceName and value is an array for traversing the data object
 * @prop Object settings -- Settings for services. Typically an 'include' parameter for processing functions that can take more than one column of data
 */ 
var rowSchema = [
  {
    'name': 'Publication',
    'type': 'String',
    'defaultval': '',
    'mapping': {
      'newsAPI': ['publication'],
      'cloudCSV': ['source']
    },
    'settings': {}
  },
  {
    'name': 'Title', 
    'type': 'String', 
    'defaultval': '', 
    'mapping': {
      'newsAPI': ['title'],
      'cloudCSV': ['headline']
    },
    'settings': {
      'naturalLanguage': {
        'include': true
      },
      'stringsOne': {
        'include': true
      }
    }
  },
  {
    'name': 'Author', 
    'type': 'String', 
    'defaultval': '', 
    'mapping': {
      'newsAPI': ['author']
    },
    'settings': {}
  },
  {
    'name': 'Brief', 
    'type': 'String', 
    'defaultval': '', 
    'mapping': {
      'newsAPI': ['description']
    },
    'settings': {
      'naturalLanguage': {
        'include': true
      },
      'stringsOne': {
        'include': true
      }
    }
  },
  {
    'name': 'Link', 
    'type': 'String', 
    'defaultval': '', 
    'mapping': {
      'newsAPI': ['url'],
      'cloudCSV': ['url']
    },
    'settings': {}
  },
  {
    'name': 'Date', 
    'type': 'String', 
    'defaultval': '', 
    'mapping': {
      'newsAPI': ['publishedAt'],
      'cloudCSV': ['publishedAt']
    },
    'settings': {}
  },
  {
    'name': 'Sentiment Magnitude', 
    'type': 'Number', 
    'defaultval': 0, 
    'mapping': {
      'naturalLanguage': ['documentSentiment','magnitude']
    },
    'settings': {}
  },
  {
    'name': 'Sentiment Score', 
    'type': 'Number', 
    'defaultval': 0, 
    'mapping': {
      'naturalLanguage': ['documentSentiment','score']
    },
    'settings': {}
  },
  {
    'name': 'Category', 
    'type': 'String', 
    'defaultval': '', 
    'mapping': {
      'naturalLanguage': ['categories',0,'name']
    },
    'settings': {}
  },
  {
    'name': 'Category Confidence', 
    'type': 'Number', 
    'defaultval': 0, 
    'mapping': {
      'naturalLanguage': ['categories',0,'confidence']
    },
    'settings': {}
  },
  {
    'name': 'Number of PERSON entities', 
    'type': 'Number', 
    'defaultval': 0, 
    'mapping': {
      'naturalPeople': ['people']
    },
    'settings': {}
  },
  {
    'name': 'Number of females (processed)', 
    'type': 'Number', 
    'defaultval': 0, 
    'mapping': {
      'genderize': ['female']
    },
    'settings': {}
  },
  {
    'name': 'Number of males (processed)', 
    'type': 'Number', 
    'defaultval': 0, 
    'mapping': {
      'genderize': ['male']
    },
    'settings': {}
  },
  {
    'name': 'Number of appearance words', 
    'type': 'Number', 
    'defaultval': 0, 
    'mapping': {
      'stringsOne': ['count']
    },
    'settings': {}
  }
];

/**
 * Service-specific settings (each service should set a default so it doesn't rely on these.
 */
var serviceSettings = {
  'naturalLanguage': {
    'concatStr': '. '
  },
  'stringsOne': {
    'concatStr': '. '
  }
};

/**
 * API keys and other things that shouldn't be hard-coded.
 *
 * @todo Make this prompt you if you don't have a dependency.
 */
var UserProperties = PropertiesService.getUserProperties();
var GoogleAPIKey = UserProperties.getProperty('GoogleAPIKey');
var appearanceWords = ['adorable', 'albino', 'attractive', 'bald', 'beautiful', 'blonde', 'blue-eyed', 'boobs',
                       'breasts', 'brown-eyed', 'brunette', 'buttocks', 'buxom', 'calming', 'chubby', 'clean', 'creepy', 
                       'curvy', 'dowdy', 'dress', 'fashionable', 'fat', 'feminine', 'fit', 'flabby', 'gorgeous', 'green-eyed', 'grumpy', 
                       'handsome', 'happy', 'heels', 'makeup', 'masculine', 'messy', 'moody', 'muscular', 'musty', 'obese', 
                       'ordinary', 'petite', 'pierced', 'plump', 'posh', 'redhead', 'rosy', 'scarf', 'scary', 'scruffy', 'sexy', 'shapely', 
                       'shaved', 'sickly', 'skinny', 'skirt', 'slender', 'sporty', 'stocky', 'tattooed', 'terrifying', 'tired', 
                       'tits', 'tranquil', 'unique', 'unusual'];

/**
 * Main execution.
 */
function main() {
  googleSheetsInitializer(); // Get the output sheet ready first.
  
  //newsAPIInputFunction('newsAPI'); // The input function. Kicks all the rest of the stuff off.
  cloudStorageInputFunction('cloudCSV');
}

/**
 * Plug in one or more processing functions and glue them together.
 *
 * @arg Array rows -- the input rows
 * @return Array rows -- the output rows, potentially modified.
 */
function processingHandler(row) {
  row = naturalLanguageProcessingFunction(row, 'naturalLanguage'); // Get sentiments and classifications.
  row = naturalLanguagePeople(row, 'naturalPeople', 'naturalLanguage'); // Count the number of people.
  
  if (row[0][10] >= 1) { // Only continue if we've found some people in the headline.
    row = genderizeProcessingFunction(row, 'genderize', 'naturalPeople'); // Count the number of women.
    
    if ((row[0][11] + row[0][12]) >= 1) {
      row = stringsProcessingFunction(row, 'stringsOne', appearanceWords); // Count the number of 'appearance' words.
      outputHandler(row);
    }
  }
}

/**
 * Plug in one of the output functions.
 *
 * Usually you don't have to change this function. If you do, it'll typically be the "output function" row.
 *
 * @arg Array rows -- the input rows
 * @return Array rows -- the output rows, potentially modified.
 */
function outputHandler(row) {
  row[0] = googleSheetsOutputFunction(row[0], 'googleSheets'); // The output function.
  cleanupHandler(row);
}

/**
 * Plug in one of the cleanup functions.
 *
 * @arg Array rows -- the input rows
 * @return Array rows -- the output rows, potentially modified.
 */
function cleanupHandler(row) {
  // row = loggerCleanupFunction(row, 'logger'); // The cleanup function.
}
