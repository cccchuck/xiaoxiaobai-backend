import { ResultSetHeader, RowDataPacket } from 'mysql2'
import connectionPool from '../app/service'
import { IShopData } from '../types/shop'

interface IGetOrderResponse extends RowDataPacket {
  id: number
  user_id: number
  items: string
  evaluation: string
  price: number
  time: string
}

interface IGetShopDatasResponse extends RowDataPacket {
  id: number
  name: string
  description: string
  imgURL: string
  price: number
  category_id: number
  category_name: string
}

interface IGetUserPwdResponse extends RowDataPacket {
  id: number
  password: string
}

interface IInsertResponse extends ResultSetHeader {
  filedCount: number
  affectedRows: number
  insertId: number
  info: string
  serverStatus: number
  warningStatus: number
}

type IDeleteResponse = IInsertResponse

type IUpdateResponse = IInsertResponse

class BackendService {
  async getUserPwd(
    username: string
  ): Promise<{ id: number; password: string }> {
    const statement = 'SELECT id, password FROM admin_user WHERE username = ?'
    const result = await connectionPool.execute<IGetUserPwdResponse[]>(
      statement,
      [username]
    )
    const { id, password } = result[0][0]
    return { id, password }
  }

  async getOrders(
    startDate: string | undefined,
    endDate: string | undefined,
    priceLimit: string | undefined,
    orderPrice: number | undefined
  ) {
    let statement = `
      SELECT
        id,
        user_id,
        items,
        evaluation,
        price,
        create_time AS \`time\`
      FROM
        \`order\`
    `
    const filter = []
    const params = []

    if (startDate && endDate) {
      filter.push('create_time >= ? && create_time <= ?')
      params.push(startDate, endDate)
    }

    if (priceLimit && orderPrice) {
      switch (priceLimit) {
        case 'GT':
          filter.push('price > ?')
          break

        case 'LT':
          filter.push('price < ?')
          break

        case 'EQ':
          filter.push('price = ?')
          break

        case 'GTE':
          filter.push('price >= ?')
          break

        case 'LTE':
          filter.push('price <= ?')
          break
      }
      params.push(orderPrice)
    }

    if (filter.length && params.length) {
      statement = statement + ' WHERE ' + filter.join(' && ')
    }

    console.log(statement)

    const result = await connectionPool.execute<IGetOrderResponse[]>(
      statement,
      params
    )
    return result[0]
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

  async addShop(categoryId: number, shopData: IShopData): Promise<boolean> {
    const statement =
      'INSERT INTO items (name, description, imgURL, price, category_id) VALUES (?, ?, ?, ?, ?)'
    const result = await connectionPool.execute<IInsertResponse>(statement, [
      shopData.name,
      shopData.description,
      shopData.imgURL,
      shopData.price,
      categoryId,
    ])
    const { affectedRows } = result[0]
    return !!affectedRows
  }

  async deleteShop(categoryId: number, id: number): Promise<boolean> {
    const statement = 'DELETE FROM items WHERE category_id = ? AND id = ?'
    const result = await connectionPool.execute<IDeleteResponse>(statement, [
      categoryId,
      id,
    ])
    const { affectedRows } = result[0]
    return !!affectedRows
  }

  async updateShop(categoryId: number, shopData: IShopData): Promise<boolean> {
    const statement =
      'UPDATE items SET name = ?, description = ?, imgURL = ?, price = ? WHERE category_id = ? AND id = ?'
    const result = await connectionPool.execute<IUpdateResponse>(statement, [
      shopData.name,
      shopData.description,
      shopData.imgURL,
      shopData.price,
      categoryId,
      shopData.id,
    ])
    const { affectedRows } = result[0]
    return !!affectedRows
  }
}

export default BackendService
