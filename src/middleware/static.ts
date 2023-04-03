import Koa from 'koa'
import koaSend from 'koa-send'

class Static {
  async static(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { url } = ctx.request
    const { pathname } = ctx.request.URL
    if (pathname.startsWith('/static')) {
      await koaSend(ctx, url)
    } else {
      await next()
    }
  }
}

export default Static
