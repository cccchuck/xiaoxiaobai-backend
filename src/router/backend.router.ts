import Router from '@koa/router'
import BackendController from '../controller/backend.controller'
import BackendMiddleWare from '../middleware/backend.middleware'

const backendUnprotectedRouter = new Router({
  prefix: '/manage',
})

const backendProtectedRouter = new Router({
  prefix: '/manage',
})

const backendMiddleWare = new BackendMiddleWare()
const backendController = new BackendController()

backendUnprotectedRouter.post(
  '/login',
  backendMiddleWare.verifyUsernamePassword,
  backendController.login
)

backendProtectedRouter.post('/getOrders')

backendProtectedRouter.post('/getShopDatas')

backendProtectedRouter.post(
  '/addShop',
  backendMiddleWare.verifyAddShop,
  backendController.addShop
)

backendProtectedRouter.post(
  '/delShop',
  backendMiddleWare.verifyDeleteShop,
  backendController.deleteShop
)

backendProtectedRouter.post(
  '/updateShop',
  backendMiddleWare.verifyUpdateShop,
  backendController.updateShop
)

export { backendUnprotectedRouter, backendProtectedRouter }
