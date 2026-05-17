import { renderNotFoundPage } from '../../modules/services/template-service.js'
import type { RouteHandler } from '../types.js'

export const notFoundHandler: RouteHandler = (_, res) => {
  const html = renderNotFoundPage()
  res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
  res.end(html)
}
