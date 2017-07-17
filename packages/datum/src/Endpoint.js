import { fromDatum, toFetch } from 'aquameta-query'

export default function Endpoint (config) {
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
