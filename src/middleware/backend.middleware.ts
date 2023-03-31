import Koa from 'koa'
import { CODES, MESSAGES } from '../app/constant'
import { buildResponse } from '../utils/common'

import type { IShopData } from '../types/shop'

class BackendMiddleWare {
  async verifyUsernamePassword(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { username, password } = body

    if (!username || !password) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
    }

    await next()
  }

  async verifyAddShop(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { categoryId, shopData } = body

    // 如果缺少 categoryId 或者有 categoryId 但是它不合法
    if (!categoryId || (categoryId && typeof categoryId !== 'number')) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    // 如果缺少 shopData 或者有 shopData 但是它不合法
    if (
      !shopData ||
      typeof shopData !== 'object' ||
      (typeof shopData === 'object' &&
        (typeof shopData.name !== 'string' ||
          typeof shopData.description !== 'string' ||
          typeof shopData.imgURL !== 'string' ||
          typeof shopData.price !== 'number'))
    ) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    await next()
  }

  async verifyDeleteShop(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { categoryId, id } = body

    // 如果缺少 categoryId 或者有 categoryId 但是它不合法
    if (!categoryId || (categoryId && typeof categoryId !== 'number')) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    // 如果缺少 id 或者有 id 但是它不合法
    if (!id || (id && typeof id !== 'number')) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    await next()
  }

  async verifyUpdateShop(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { categoryId, shopData } = body

    // 如果缺少 categoryId 或者有 categoryId 但是它不合法
    if (!categoryId || (categoryId && typeof categoryId !== 'number')) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    // 如果缺少 shopData 或者有 shopData 但是它不合法
    if (
      !shopData ||
      typeof shopData !== 'object' ||
      (typeof shopData === 'object' &&
        (typeof shopData.id !== 'number' ||
          typeof shopData.name !== 'string' ||
          typeof shopData.description !== 'string' ||
          typeof shopData.imgURL !== 'string' ||
          typeof shopData.price !== 'number'))
    ) {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
      return
    }

    await next()
  }
}

export default BackendMiddleWare
