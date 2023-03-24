/**
 * 日志中间件
 * 记录所有请求日志，便于定位错误及分析
 */

import log4js from 'log4js'
import Koa from 'koa'

log4js.configure({
  appenders: {
    error: {
      type: 'file',
      filename: './log/error.log',
    },
    normal: {
      type: 'file',
      filename: './log/log.log',
    },
    console: {
      type: 'console',
    },
  },
  categories: {
    default: {
      appenders: ['normal', 'console'],
      level: 'info',
    },
  },
})

const loggerInfo = log4js.getLogger('normal')
const loggerError = log4js.getLogger('error')

const logger = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  loggerInfo.info(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`)
}

export { logger, loggerInfo, loggerError }
