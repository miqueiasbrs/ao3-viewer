import type { IncomingMessage, ServerResponse } from 'node:http'

import { chaptersHandler } from './handlers/chapters-handler.js'
import { homeHandler } from './handlers/home-handler.js'
import { notFoundHandler } from './handlers/not-found-handler.js'

const routes: Route[] = [
  { method: 'GET', path: '/', handler: homeHandler },
  { method: 'GET', path: '/chapters/{id}', handler: chaptersHandler }
]

const normalizePath = (path: string) => {
  if (path === '/') return '/'

  const normalized = path.replace(/\/+$/, '')
  return normalized.length > 0 ? normalized : '/'
}

const isDynamicSegment = (segment: string) => {
  return /^\{[a-zA-Z0-9_]+\}$/.test(segment)
}

const matchesRoutePath = (routePath: string, requestPath: string) => {
  const normalizedRoute = normalizePath(routePath)
  const normalizedRequest = normalizePath(requestPath)

  if (normalizedRoute === normalizedRequest) {
    return true
  }

  const routeSegments = normalizedRoute.split('/').filter(Boolean)
  const requestSegments = normalizedRequest.split('/').filter(Boolean)

  if (routeSegments.length !== requestSegments.length) {
    return false
  }

  return routeSegments.every((segment, index) => {
    return segment === requestSegments[index] || isDynamicSegment(segment)
  })
}

export const routeRequest = (req: IncomingMessage, res: ServerResponse) => {
  const requestPath = req.url ? new URL(req.url, 'http://localhost').pathname : '/'
  const route = routes.find((route) => route.method === req.method && matchesRoutePath(route.path, requestPath))

  if (!route) {
    notFoundHandler(req, res)
    return
  }

  route.handler(req, res)
}
