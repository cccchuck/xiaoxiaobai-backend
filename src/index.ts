import Koa from 'koa'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'

import Auth from './middleware/auth'
import Cors from './middleware/cors'
import Static from './middleware/static'

import { PORT } from './app/config'
import { logger } from './logger/index'
import { protectedRouter, unprotectedRouter } from './router'
import path from 'path'

const app = new Koa()

const auth = new Auth()
const staticServer = new Static()

const staticPath = path.join(__dirname, '../static')

app.use(logger)
app.use(Cors)
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '../static'),
      keepExtensions: true,
    },
  })
)
app.use(koaStatic(staticPath))
app.use(staticServer.static)
app.use(unprotectedRouter.routes())
app.use(unprotectedRouter.allowedMethods())
app.use(auth.verify)
app.use(protectedRouter.routes())
app.use(protectedRouter.allowedMethods())

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 Koa 服务已在 http://0.0.0.0:${PORT} 启动`)
})
