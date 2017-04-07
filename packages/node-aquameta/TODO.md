# TODO

# Thoughts
- Weigh the benefits of storing code in database
- Weigh the benefits of not using webpack through pgfs to bundle code
- Can I still use this package without storing code in the database? How?

- A drawback to dynamic widget loading is having multiple code bundles. There is
the possibility of including a package multiple times. This could be a problem?
Or can it?

- Webpack bundle mapping url to query?

# Server
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

# Database
bundle_javascript function
Test
