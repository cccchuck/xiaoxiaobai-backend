import Koa from 'koa'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { buildResponse } from '../utils/common'
import { CODES, MESSAGES } from '../app/constant'
import MiniprogramService from '../service/miniprogram.service'

const miniprogramService = new MiniprogramService()

const manageVerify = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const { authorization } = ctx.request.header
  // 如果未携带 Token 直接返回
  if (!authorization) {
    ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
    return
  }

  try {
    const { exp } = jwt.decode(authorization.slice(7)) as JwtPayload

    if (exp && exp * 1000 < Date.now()) {
      ctx.body = buildResponse(CODES.Expired, MESSAGES.Expired)
      return
    }
  } catch (error) {
    ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
    return
  }

  await next()
}

const appVerify = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const { body } = ctx.request
  const { id, openid } = body

  if (!id || !openid) {
    ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
    return
  }

  const _id = await miniprogramService.getUserId(openid)

  if (id === _id) {
    await next()
  } else {
    ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
  }
}

class Auth {
  async verify(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    if (ctx.URL.pathname.startsWith('/app')) {
      await appVerify(ctx, next)
    } else if (ctx.URL.pathname.startsWith('/manage')) {
      await manageVerify(ctx, next)
    }
  }
}

export default Auth
