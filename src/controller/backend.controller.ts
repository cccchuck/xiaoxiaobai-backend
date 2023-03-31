import Koa from 'koa'
import jwt from 'jsonwebtoken'
import BackendService from '../service/backend.service'
import { comparePassword } from '../utils/crypto'
import { CODES, MESSAGES } from '../app/constant'
import { buildResponse } from '../utils/common'
import { SECRET } from '../app/config'

const backendService = new BackendService()

class BackendController {
  async login(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { username, password } = body
    const { id, password: hashPwd } = await backendService.getUserPwd(username)

    if (comparePassword(password, hashPwd)) {
      const token = jwt.sign({ id, username }, SECRET, { expiresIn: '2h' })
      ctx.body = buildResponse(CODES.Success, MESSAGES.Success, {
        token,
      })
    } else {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
    }
  }

  async addShop(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { categoryId, shopData } = body

    const result = await backendService.addShop(categoryId, shopData)

    if (result) {
      ctx.body = buildResponse(CODES.Success, MESSAGES.Success)
    } else {
      ctx.body = buildResponse(CODES.ServerError, MESSAGES.ServerError)
    }
  }

  async deleteShop(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { categoryId, id } = body

    const result = await backendService.deleteShop(categoryId, id)

    if (result) {
      ctx.body = buildResponse(CODES.Success, MESSAGES.Success)
    } else {
      ctx.body = buildResponse(CODES.ServerError, MESSAGES.ServerError)
    }
  }

  async updateShop(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { categoryId, shopData } = body

    const result = await backendService.updateShop(categoryId, shopData)

    if (result) {
      ctx.body = buildResponse(CODES.Success, MESSAGES.Success)
    } else {
      ctx.body = buildResponse(CODES.ServerError, MESSAGES.ServerError)
    }
  }
}

export default BackendController
