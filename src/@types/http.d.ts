declare type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void
declare type Route = {
  method: string
  path: string
  handler: (req: IncomingMessage, res: ServerResponse) => void
}
