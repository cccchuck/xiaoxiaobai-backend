import Koa from 'koa'
import koaBody from 'koa-body'

import Auth from './middleware/auth'
import { PORT } from './app/config'
import { logger } from './logger/index'
import { protectedRouter, unprotectedRouter } from './router'

const app = new Koa()

const auth = new Auth()

app.use(logger)
app.use(koaBody())
app.use(unprotectedRouter.routes())
app.use(unprotectedRouter.allowedMethods())
app.use(auth.verify)
app.use(protectedRouter.routes())
app.use(protectedRouter.allowedMethods())

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 Koa 服务已在 http://0.0.0.0:${PORT} 启动`)
})
