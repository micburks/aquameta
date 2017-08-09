# TODO

# Thoughts
- Weigh the benefits of storing code in database
- Weigh the benefits of not using webpack through pgfs to bundle code
- Can I still use this package without storing code in the database? How?

- A drawback to dynamic widget loading is having multiple code bundles. There is
the possibility of including a package multiple times. This could be a problem?
Or can it?

- Webpack bundle mapping url to query?

# API
there is no reason to place schema on an endpoint object
there is not yet a use case for creating a new db endpoint
schema function should be top-level

# Server
Create endpoint as middleware
Build logging/connection pooling on top of pg
Try webpack programmatic bundle
- Write loader
- Write plugin
- or write enhance-resolve plugin
Test

# Front end
Finish Datum
Rewrite widget
Test
Widget will need to have its own 'require' function to async get other code
Widget will need to be global on page

# Database
bundle_javascript function
Test

# Source URLs
a script tag can use a source url and the response will be of the mimetype of the column
OR
a source url maybe be 'require'd in a widget, and will be requested from
 'widget', enabling us to make the response have a JSON mimetype
