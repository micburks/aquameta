const aquameta = require('./dist/aquameta.js'); // require('aquameta');
const express = require('express');
const app = express();

/**********************************************************/
/* SERVER-SIDE USAGE: */
/**********************************************************/
const endpointConfig = {
  url: '/endpoint',
  version: '0.1',
  node: true,
};

// Add Aquameta middleware and routes to the app
app.use(aquameta(endpointConfig));

app.listen(3000);
