import { renderHomePage } from '../../modules/services/template-service.js'
import type { RouteHandler } from '../types.js'

export const homeHandler: RouteHandler = (_req, res) => {
  const html = renderHomePage()
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(html)
}
