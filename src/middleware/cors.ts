import Koa from 'koa'

const setCors = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept'
  )
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  ctx.set('Access-Control-Allow-Credentials', 'true')

  if (ctx.method === 'OPTIONS') {
    ctx.body = ''
  } else {
    await next()
  }
}

export default setCors
