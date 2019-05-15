# datum

#### TODO

- [X] make datum and server use the same url by default
- [ ] audit config usage
- [ ] support aquameta.config.js
- [ ] use `select where in` in readTables upsert method
- [ ] sync - use config for writing files, too
  - could write id as a file and name the directory some combination of id and
    name for better readability. maybe this could be configured
  - could write a default config to config.js on every export
- [ ] rewrite endpoint.request
  - update doesnt work the way we have it - requires row id intead of just
    filtered table
- [ ] make note in datum readme that each API call happens in its own
  transaction, so if you want an actual transaction you should be writing that
  in a stored procedure
- [ ] Get rid of console.logs for connection
- [ ] Add demos or tests for each package
- [ ] Add postinstall script that does `cat setup.sql | psql aquameta`
- [ ] combine all todos (not sure where they are)
- [ ] test everything
- [ ] write widget
- [ ] make an app that uses this - will find a lot of things to fix and a lot
  of things to document this way
- [X] finish sync
- [ ] provide a top-level sql file for each package
- [ ] make a install file for aquameta that removes a lot of dependencies (easy
  install path for mac)
- [ ] finish simple API for datum
- [X] keep react-like vs vue-like widget APIs, but start by using React without jsx
- [ ] document all the ideas/concepts in wiki or something
- [ ] flow/lint/test before allowing publishing
- [ ] CI?
- [ ] simple api -> sync import/export -> widget test env
- [ ] deprecate/archive old repos
- [ ] general migration library?
- [ ] add debug logging
- [X] add config.json to each table dir for sync
- [ ] connection pooling
- [ ] chunk large insert/updates
- [ ] why is datumRouter calling (await request.json()).request? for source url
- [ ] make sure version from client request is passed into endpoint.request,
  not the API version of the server that accepts the request
  - clients dont care about the version
    - they create a request with a url, that url should be used when the query is actually run
    - otherwise we are completely ignoring it and just making the request with whatever ;
    - version in the url should override the client version
    - client version is only important for which version url is created
    - url version should go straight to database


#### Tech debt

- Remove all resource tables in lieu of source urls
  - Open question: Will binaries work properly in source urls?
- Move endpoint.source function into endpoint core, have endpoint.request be
  aware of source urls and pass off to endpoint.source. Have the appropriate
  mimetype come out of that endpoint.request instead of always JSON
- Refactor endpoint.resource to be have 2 fields: url, field_id
  - Do not store any content in endpoint.resource


#### Decision to not have a database.source() function

source urls reference a field and therefore return a "file" with a mimetype
it doesn't make sense to have a database.source() function

on server:
doesnt make sense to use this on the server, you still need other information from http request
in that case, http can emcompass both functionalities and just figure out how to parse the request

in browser:
from the client, you wouldn't want to use datum to get files. you would just use fetch or import
source urls are meant for compatiblity with current technologies, not accessed thorugh datum


#### What ways are there to get data in the node server?

- datumRouter: datum and source urls are passed off to database.http
- pageRouter: other paths will use datum to look for a row in endpoint.resource,
  - endpoint.resource is a map of urls to fields instead of containing content


#### Performance

- quick test on functions
`endpoint.source/{text,text,text,text} args: {} // typed call`
was 10X slower than
`endpoint.source args: [] // anonymous call`


#### Thoughts

- Weigh the benefits of storing code in database
- Why are we not using webpack through pgfs to bundle code
- Or Webpack bundle mapping url to query?
- Why we use jspm.io - before we were storing the library in the database


#### API

- there is no reason to place schema on an endpoint object
- there is not yet a use case for creating a new db endpoint
- schema function should be top-level


#### Source URLs

a script tag can use a source url and the response will be of the mimetype of the column
OR
a source url maybe be 'require'd in a widget, and will be requested from
 'widget', enabling us to make the response have a JSON mimetype
