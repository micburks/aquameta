/* globals location fetch */

/**
 * Fetch query results client-side
 * @returns {Promise}
 */
export default async function executeEndpoint (client, query) {
  let requestUrl = `/${client.url}/${client.version}/${query.url}`.replace(/\/+/g, '/')
  const urlWithQuery = `${requestUrl}?${getQueryString(query.args)}`

  const options = {
    method: query.method,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // If query string is too long, upgrade GET method to POST
  if (query.method === 'GET') {
    if ((location.host + urlWithQuery).length > 1000) {
      options.method = 'POST'
      // This doesn't make sense - stringifying data instead of args
      // TODO: is this promotion/check even worth it
      options.body = JSON.stringify(query.data)
    } else {
      requestUrl = urlWithQuery
    }
  } else if (query.data) {
    options.body = JSON.stringify(query.data)
  }

  console.log('endpoint:', { requestUrl, options })

  try {
    const response = await fetch(requestUrl, options)
    /*
    if (response.status < 200 || response.status >= 300) {
      // If bad request (code 300 or higher), reject promise
      throw new Error(response)
    }
    */
    // Read json stream
    return response.json()
  } catch (error) {
    // Log error in collapsed group
    console.groupCollapsed(query.method, error.statusCode, error.title)
    if ('message' in error) {
      console.error(error.message)
    }
    console.groupEnd()
    throw error.title
  }
}

// Map the keys of the args object to an array of encoded url components
function getQueryString (args) {
  return Object
    .keys(args)
    .sort()
    .map(argName => getQueryPart(argName, args[argName]))
    .map(({key, value}) => key ? `${key}=${value}` : value)
    .join('&')
    .replace(/&&/g, '&')
}

function getQueryPart (argName, arg) {
  let key = argName
  let value = null

  switch (argName) {
    case 'where': // where: [{ name: 'column_name', op: '=', value: 'value' }]
      arg = asArray(arg)
      key = null
      value = arg
        .map(w => {
          let value = encodeURIComponent(JSON.stringify(w))
          return `where=${value}`
        })
        .join('&')
      break

    case 'order_by': // order_by: [{ column: 'column_name', direction: 'asc|desc' }]
      arg = asArray(arg)
      const columnList = concatMap(arg, col => {
        if (typeof col === 'string') {
          return col
        } else {
          if ('column' in col && 'direction' in col) {
            let { column, direction } = col
            return direction !== 'asc' ? `-${column}` : `${column}`
          } else {
            return Object
              .keys(col)
              .map(columnName => {
                return col[columnName] !== 'asc' ? `-${columnName}` : `${columnName}`
              })
          }
        }
      })
      value = encodeURIComponent(columnList.join(','))
      break

    case 'limit': // limit: number
    case 'offset': // offset: number
      let parsedNum = parseInt(arg)
      if (!isNaN(parsedNum)) {
        value = parsedNum
        break
      }
      key = value = null
      break

    case 'evented':
      key = 'session_id'

    case 'metaData': // eslint-disable-line no-fallthrough
    case 'args':
    case 'exclude':
    case 'include':
      value = encodeURIComponent(JSON.stringify(arg))
      break

    default:
      key = value = null
  }

  return { key, value }
}

function asArray (arg) {
  return !arg.length ? [arg] : arg
}

function concatMap (arr) {
  return arr.reduce((acc, item) => {
    if (item instanceof Array) {
      acc.concat(item)
    } else {
      acc.push(item)
    }
    return acc
  }, [])
}
