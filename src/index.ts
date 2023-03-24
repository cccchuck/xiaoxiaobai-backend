import Koa from 'koa'
import koaBody from 'koa-body'
import { logger } from './logger/index'

const app = new Koa()

app.use(logger)
app.use(koaBody())

app.use(async (ctx, next) => {
  // console.log({ ctx, args })
  // console.log('request: ', ctx.request)
  // console.log('req: ', ctx.req)
  console.log(ctx.request.body)
  ctx.body = 'Hello World'
})

app.listen(3000)
