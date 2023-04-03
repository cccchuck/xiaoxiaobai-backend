import Koa from 'koa'
import { buildResponse } from '../utils/common'
import { CODES, MESSAGES } from '../app/constant'

class MiniprogramMiddleWare {
  async verifyLogin(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { code } = body
    if (!code || (code && typeof code !== 'string')) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    await next()
  }

  async verifyGetShopDatas(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    await next()
  }

  async verifyAddOrder(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { items, price } = ctx.request.body

    if ((items && !items.length) || !items || !price) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    if ((price && typeof price !== 'number') || price < 0) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    await next()
  }

  async verifyGetOrders(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    await next()
  }

  async verifySetEvaluation(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { evaluation, orderId } = ctx.request.body

    if (!orderId || (orderId && typeof orderId !== 'number')) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    if (!evaluation || (evaluation && typeof evaluation !== 'string')) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    await next()
  }
}

export default MiniprogramMiddleWare
