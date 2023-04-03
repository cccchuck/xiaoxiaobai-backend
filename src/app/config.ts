import { config } from 'dotenv'

config()

const SECRET = process.env.SECRET as string
const PORT = parseInt(process.env.PORT as string)
const MYSQL_HOST = process.env.MYSQL_HOST as string
const MYSQL_USER = process.env.MYSQL_USER as string
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT as string)
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD as string
const MYSQL_DATABASE = process.env.MYSQL_DATABASE as string
const MINI_PROGRAM_APP_ID = process.env.MINI_PROGRAM_APP_ID as string
const MINI_PROGRAM_APP_SECRET = process.env.MINI_PROGRAM_APP_SECRET as string

export {
  PORT,
  SECRET,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PORT,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MINI_PROGRAM_APP_ID,
  MINI_PROGRAM_APP_SECRET,
}
