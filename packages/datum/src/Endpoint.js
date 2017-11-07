import { fromDatum, toFetch } from 'aquameta-query'

export default function Endpoint (config) {

  // TODO: endpoint needs to look for a cookie override in config
  // cookie override could come from server-side datum request

  const query = method =>
    (metaId, args, data) => {
      let query = fromDatum(method, metaId, args, data)
      return toFetch(query)
    }

  return {
    config: () => config,
    get: query('GET'),
    post: query('POST'),
    patch: query('PATCH'),
    delete: query('DELETE')
  }
}
