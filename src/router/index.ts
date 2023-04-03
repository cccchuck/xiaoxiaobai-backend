import Router from '@koa/router'

import {
  backendProtectedRouter,
  backendUnprotectedRouter,
} from './backend.router'

import {
  miniprogramProtectedRouter,
  miniprogramUnprotectedRouter,
} from './miniprogram.router'

const unprotectedRouter = new Router()
const protectedRouter = new Router()

protectedRouter.use(
  backendProtectedRouter.routes(),
  backendProtectedRouter.allowedMethods(),
  miniprogramProtectedRouter.routes(),
  miniprogramProtectedRouter.allowedMethods()
)

unprotectedRouter.use(
  backendUnprotectedRouter.routes(),
  backendUnprotectedRouter.allowedMethods(),
  miniprogramUnprotectedRouter.routes(),
  miniprogramUnprotectedRouter.allowedMethods()
)

export { protectedRouter, unprotectedRouter }
