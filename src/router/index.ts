import Router from '@koa/router'

import {
  backendUnprotectedRouter,
  backendProtectedRouter,
} from './backend.router'

const unprotectedRouter = new Router()
const protectedRouter = new Router()

unprotectedRouter.use(
  backendUnprotectedRouter.routes(),
  backendUnprotectedRouter.allowedMethods()
)

protectedRouter.use(
  backendProtectedRouter.routes(),
  backendProtectedRouter.allowedMethods()
)

export { unprotectedRouter, protectedRouter }
