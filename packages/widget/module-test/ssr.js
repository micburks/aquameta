// import regular from './regular-module.js';
// regular();
// import('./widget-test.js')
// import('./regular-module.js')
import * as datum from '/db/widget/dep/datum.js';
const {client, database, query} = datum;
/*
import('/db/widget/dep/datum.js')
  .then(({default: module}) => {
    console.log({module});
    module();
  })
  */
