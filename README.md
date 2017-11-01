# Data Science Toolkit

This collection of Google Apps Scripts is intended for performing textual and other analysis
on data rows, then saving the processed data in a usable format.

## Output format

In order to keep everything organized, the scripts rely on a set schema for output rows. You 
should set up your row schema in the global variable below.

## Google APIs

Since we rely on a lot of Google APIs, you should set a "User Property" in Files > Project Properties
with a key of 'GoogleAPIKey' and a value of an API from the Cloud console. The App will prompt you to 
set up APIs within the console for the calls your app makes.

## Flexible mappings

If you want to swap an input, processing, output, or cleanup function out, but don't want to completely
redo the schema (for instance, if you want to switch back and forth between inputs), you can leave unused 
mappings, settings, and other properties in place. They will only do something if the service in question 
is active.
