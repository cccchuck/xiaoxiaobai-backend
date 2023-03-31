import Koa from 'koa'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { buildResponse } from '../utils/common'
import { CODES, MESSAGES } from '../app/constant'

class Auth {
  async verify(ctx: Koa.ParameterizedContext, next: Koa.Next) {
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
}

export default Auth
