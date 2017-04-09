const Query = function( config ) {
  this.config = config
  return this
}

/* Set query based on datum request */
Query.prototype.fromRequest = function( req ) {

  this.method = req.method
  this.metaId = req.url.split('?')[0]
  this.args = req.query
  this.data = req.body

  // Do not need this.queryString

  // metaData defaults to true
  this.args.metaData = this.args.hasOwnProperty('metaData') ? this.args.metaData : true

  console.log('fromRequest args', this.args)
}

/* Set query based on programmatic api */
Query.prototype.fromDatum = function( method, metaId, args, data ) {

  this.method = method
  this.metaId = metaId.toUrl()
  this.args = args || {}
  this.data = data || {}

  // metaData defaults to true
  this.args.metaData = this.args.hasOwnProperty('metaData') ? this.args.metaData : true

  // Map the keys of the args object to an array of encoded url components
  this.queryString = Object.keys(this.args).sort().map(keyName => {

    let key = this.args[keyName]

    switch(keyName) {

      case 'where':
        // where: { name: 'column_name', op: '=', value: 'value' }
        // where: [{ name: 'column_name', op: '=', value: 'value' }]
        key = !key.length ? [key] : key

        return key.map(w => `where=${ encodeURIComponent( JSON.stringify(w) ) }` ).join('&')

      case 'order_by':
        // So many possibilities...
        // order_by: '-?column_name'
        // order_by: ['-?column_name']
        // order_by: { 'column_name': 'asc|desc' }
        // order_by: [{ 'column_name': 'asc|desc' }]
        // order_by: { column: 'column_name', direction: 'asc|desc' }
        // order_by: [{ column: 'column_name', direction: 'asc|desc' }]
        key = !key.length ? [key] : key

        return `${ keyName }=${
                    encodeURIComponent(
                      key.map((o,i) => (o.direction !== 'asc' ? '-' : '') + o.column)
                      .join(',')
                    )
                }`

      case 'limit':
        // limit: number
      case 'offset':
        // offset: number
        let parsedNum = parseInt(key)
        if (!isNaN(parsedNum)) {
          return `${keyName}=${parsedNum}`
        }
        return

      case 'evented':
        return 'session_id=' + encodeURIComponent(JSON.stringify(key))

      case 'metaData':
      case 'args':
      case 'exclude':
      case 'include':
        return `${keyName}=${ encodeURIComponent( JSON.stringify(key) ) }`
    }
  })
    .join('&')
  //.replace(/^/, '?')
    .replace(/&&/g, '&')

  console.log('fromDatum queryString', this.queryString)

};

/* Client-side */
Query.prototype.fetch = function() {

  let baseUrl = `/${this.config.url}/${this.config.version}`.replace(/\/+/g, '/')
  console.log('base url for fetch', baseUrl)

  // URLs
  let urlWithoutQuery = baseUrl + this.metaId
  let urlWithQuery = urlWithoutQuery + this.queryString.replace(/^\?*/, '?')

  // If query string is too long, upgrade GET method to POST
  if(this.method === 'GET' && (location.host + urlWithQuery).length > 1000) {
    this.method = 'POST'
  }

  // This makes the uWSGI server send back json errors
  let headers = new Headers()
  headers.append('Content-Type', 'application/json')

  // Settings object to send with 'fetch' method
  let initObject = {
    method: this.method,
    headers: headers,
    credentials: 'same-origin'
  }

  // Don't add data on GET requests
  if (this.method !== 'GET') {
    initObject.body = JSON.stringify(this.data)
  }

  return fetch(this.method === 'GET' ? urlWithQuery : urlWithoutQuery, initObject)
    .then(response => {

      // Read json stream
      var json = response.json()

      if (response.status >= 200 && response.status < 300) {
        return json
      }

      // If bad request (code 300 or higher), reject promise
      return json.then(Promise.reject.bind(Promise))

    })
    .catch(error => {

      // Log error in collapsed group
      console.groupCollapsed(method, error.statusCode, error.title)
      if ('message' in error) {
        console.error(error.message)
      }
      console.groupEnd()
      throw error.title

    });

};

/* Server-side */
Query.prototype.execute = function( connection ) {

  return connection.then(client => {

    console.log('trying connection', this.config.version, this.method, this.metaId, JSON.stringify(this.args), JSON.stringify(this.data))

    return client.query(
      'select status, message, response, mimetype ' +
      'from endpoint.request($1, $2, $3, $4::json, $5::json)', [
        this.config.version,
        this.method,
        this.metaId,
        JSON.stringify(this.args),
        JSON.stringify(this.data)
      ])

      .then(result => {

        // release client
        //client.release()

        result = result.rows[0];
        if (result.status >= 400) throw result

        return result
      })

      .catch(err => {

        if (client.release) client.release()
        console.log('error in endpoint.request query', err)

      })

  })

}

module.exports = Query

