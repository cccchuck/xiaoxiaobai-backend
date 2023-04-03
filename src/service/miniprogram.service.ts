import { ResultSetHeader, RowDataPacket } from 'mysql2'
import connectionPool from '../app/service'

interface IGetUserResponse extends RowDataPacket {
  id: number
}

interface IInsertResponse extends ResultSetHeader {
  filedCount: number
  affectedRows: number
  insertId: number
  info: string
  serverStatus: number
  warningStatus: number
}

type IUpdateResponse = IInsertResponse

interface IGetShopDatasResponse extends RowDataPacket {
  id: number
  name: string
  description: string
  imgURL: string
  price: number
  category_id: number
  category_name: string
}

interface IGetOrdersResponse extends RowDataPacket {
  id: number
  items: string
  evaluation: string
  price: number
  time: string
}

class MiniprogramService {
  async getUserId(openid: string) {
    const statement = 'SELECT id FROM client_user WHERE openid = ?'
    const result = await connectionPool.execute<IGetUserResponse[]>(statement, [
      openid,
    ])

    if (result[0].length) {
      return result[0][0].id
    } else {
      return null
    }
  }

  async login(openid: string) {
    const id = await this.getUserId(openid)

    if (id) {
      return { id, openid }
    } else {
      const statement = 'INSERT INTO client_user (openid) VALUES (?)'
      const result = await connectionPool.execute<IInsertResponse>(statement, [
        openid,
      ])
      if (result[0].affectedRows) {
        return { id: result[0].insertId, openid }
      } else {
        return { id: null, openid }
      }
    }
  }

  async getShopDatas() {
    const statement = `
      SELECT
        items.id,
        items.name,
        items.description,
        items.imgURL,
        items.price,
        items.category_id,
        category.name AS category_name
      FROM
        items
        INNER JOIN category ON items.category_id = category.id
    `
    const result = await connectionPool.execute<IGetShopDatasResponse[]>(
      statement
    )
    return result[0]
  }

  async addOrder(id: number, items: unknown, price: number) {
    const statement =
      'INSERT INTO `order` (user_id, items, price) VALUES (?, ?, ?)'
    const result = await connectionPool.execute<IInsertResponse>(statement, [
      id,
      JSON.stringify(items),
      price,
    ])

    return !!result[0].affectedRows
  }

  async getOrders(id: number) {
    const statement =
      'SELECT id, items, evaluation, price, create_time as time FROM `order` WHERE user_id = ?'
    const result = await connectionPool.execute<IGetOrdersResponse[]>(
      statement,
      [id]
    )
    return result[0]
  }

  async setEvaluation(id: number, userId: number, evaluation: string) {
    const statement =
      'UPDATE `order` SET evaluation = ? WHERE id = ? && user_id = ?'
    const result = await connectionPool.execute<IUpdateResponse>(statement, [
      evaluation,
      id,
      userId,
    ])
    const { affectedRows } = result[0]
    return !!affectedRows
  }
}

export default MiniprogramService
