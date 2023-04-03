import Koa from 'koa'
import jwt from 'jsonwebtoken'
import BackendService from '../service/backend.service'
import { comparePassword } from '../utils/crypto'
import { CODES, MESSAGES } from '../app/constant'
import { buildResponse } from '../utils/common'
import { SECRET } from '../app/config'
import { createReadStream, createWriteStream } from 'fs'
import path from 'path'

interface IGetShopDataResponse {
  categoryId: number
  categoryName: string
  categoryShops: {
    id: number
    name: string
    description: string
    imgURL: string
    price: number
  }[]
}

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

  async getOrders(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { startDate, endDate, priceLimit, orderPrice } = body

    const result = await backendService.getOrders(
      startDate,
      endDate,
      priceLimit,
      orderPrice
    )
    result.forEach((item) => (item.items = JSON.parse(item.items)))

    ctx.body = buildResponse(CODES.Success, MESSAGES.Success, result)
  }

  async getShopDatas(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const data: IGetShopDataResponse[] = []

    const shopDatas = await backendService.getShopDatas()

    shopDatas.forEach((item) => {
      const categoryIndex = data.findIndex(
        (shop) => shop.categoryId === item.category_id
      )

      if (categoryIndex !== -1) {
        data[categoryIndex].categoryShops.push({
          id: item.id,
          name: item.name,
          description: item.description,
          imgURL: item.imgURL,
          price: item.price,
        })
      } else {
        data.push({
          categoryId: item.category_id,
          categoryName: item.category_name,
          categoryShops: [
            {
              id: item.id,
              name: item.name,
              description: item.description,
              imgURL: item.imgURL,
              price: item.price,
            },
          ],
        })
      }
    })

    ctx.body = buildResponse(CODES.Success, MESSAGES.Success, data)
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

  async uploadImg(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { files } = ctx.request
    if (files) {
      const file = files.files as any
      const fileName = file.newFilename
      const reader = createReadStream(file.filepath)
      reader.pipe(file._writeStream)
      ctx.body = buildResponse(CODES.Success, MESSAGES.Success, {
        uid: fileName.split('.')[0],
        url: `http://localhost:8000/static/${fileName}`,
      })
    }
  }
}

export default BackendController
