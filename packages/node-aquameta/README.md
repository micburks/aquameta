# What can node-aquameta do?

## Everything that the uwsgi currently does in Aquameta
Receives an http request and performs:
- a page query
- a datum query
- apply auth middleware
- return binary
- open/close socket connections and through this:
-- performs a datum query
-- pass on notify's
A script query will be added to the spec

## The Datum API
The datum API server-side
Which is packaged and delivered client-side for the same usage

## The Widget API
Dynamic widget fetching/rendering
Extensible so that other front-end architectures can be implemented

## Babel transpiling
Transpile all code for ES6 syntax
This will have to happen everywhere bundle_javascript is called
- Page query, script query, widget query


# In Database
Page query, script query, and widget query will all actually be run through
bundle_javascript function

## bundle_javascript function
Follows import statements and converts them to ES6
Evaluates export statements
In fine, this will be a javascript compiler that is only interested in
import/export statements

