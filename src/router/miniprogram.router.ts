import Router from '@koa/router'

import MiniprogramMiddleWare from '../middleware/miniprogram.middleware'
import MiniprogramController from '../controller/miniprogram.controller'

const miniprogramMiddleWare = new MiniprogramMiddleWare()
const miniprogramController = new MiniprogramController()

const miniprogramProtectedRouter = new Router({
  prefix: '/app',
})
const miniprogramUnprotectedRouter = new Router({
  prefix: '/app',
})

miniprogramUnprotectedRouter.post(
  '/login',
  miniprogramMiddleWare.verifyLogin,
  miniprogramController.login
)

miniprogramUnprotectedRouter.get(
  '/getShopDatas',
  miniprogramMiddleWare.verifyGetShopDatas,
  miniprogramController.getShopDatas
)

miniprogramProtectedRouter.post(
  '/addOrder',
  miniprogramMiddleWare.verifyAddOrder,
  miniprogramController.addOrder
)

miniprogramProtectedRouter.post(
  '/getOrders',
  miniprogramMiddleWare.verifyGetOrders,
  miniprogramController.getOrders
)

miniprogramProtectedRouter.post(
  '/setEvaluation',
  miniprogramMiddleWare.verifySetEvaluation,
  miniprogramController.setEvaluation
)

export { miniprogramProtectedRouter, miniprogramUnprotectedRouter }
