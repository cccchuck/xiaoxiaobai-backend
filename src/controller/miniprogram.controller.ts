import Koa from 'koa'
import axios from 'axios'

import MiniprogramService from '../service/miniprogram.service'
import { buildResponse } from '../utils/common'
import { CODES, MESSAGES } from '../app/constant'
import { MINI_PROGRAM_APP_ID, MINI_PROGRAM_APP_SECRET } from '../app/config'

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

const miniprogramService = new MiniprogramService()

class MiniprogramController {
  async login(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { body } = ctx.request
    const { code } = body

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${MINI_PROGRAM_APP_ID}&secret=${MINI_PROGRAM_APP_SECRET}&js_code=${code}&grant_type=authorization_code`

    try {
      const response = await axios.get(url)

      if (response.status === 200) {
        const { openid } = response.data
        const { id } = await miniprogramService.login(openid)

        if (id) {
          ctx.body = buildResponse(CODES.Success, MESSAGES.Success, {
            id,
            openid,
          })
        } else {
          ctx.body = buildResponse(CODES.ServerError, MESSAGES.ServerError)
        }
      }
    } catch (error) {
      ctx.body = buildResponse(CODES.ServerError, MESSAGES.ServerError)
    }
  }

  async getShopDatas(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const data: IGetShopDataResponse[] = []

    const shopDatas = await miniprogramService.getShopDatas()

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

  async addOrder(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { id, items, price } = ctx.request.body

    const status = await miniprogramService.addOrder(id, items, price)

    if (status) {
      ctx.body = buildResponse(CODES.Success, MESSAGES.Success)
    } else {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
    }
  }

  async getOrders(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { id } = ctx.request.body

    const orders = await miniprogramService.getOrders(id)

    orders.forEach((order) => (order.items = JSON.parse(order.items)))

    ctx.body = buildResponse(CODES.Success, MESSAGES.Success, orders)
  }

  async setEvaluation(ctx: Koa.ParameterizedContext, next: Koa.Next) {
    const { id, orderId, evaluation } = ctx.request.body

    const status = await miniprogramService.setEvaluation(
      orderId,
      id,
      evaluation
    )

    if (status) {
      ctx.body = buildResponse(CODES.Success, MESSAGES.Success)
    } else {
      ctx.body = buildResponse(CODES.BadRequest, MESSAGES.BadRequest)
    }
  }
}

export default MiniprogramController
