import { config } from 'dotenv'

config()

const SECRET = process.env.SECRET as string
const PORT = parseInt(process.env.PORT as string)
const MYSQL_HOST = process.env.MYSQL_HOST as string
const MYSQL_USER = process.env.MYSQL_USER as string
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT as string)
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD as string
const MYSQL_DATABASE = process.env.MYSQL_DATABASE as string

export {
  PORT,
  SECRET,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PORT,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
}
