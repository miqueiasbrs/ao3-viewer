import { createServer } from 'node:http'

import { routeRequest } from './http/router.js'

export const app = createServer((req, res) => routeRequest(req, res))
