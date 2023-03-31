import { ResultSetHeader, RowDataPacket } from 'mysql2'
import connectionPool from '../app/service'
import { IShopData } from '../types/shop'

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
