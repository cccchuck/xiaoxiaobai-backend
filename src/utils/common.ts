import { CODES, MESSAGES } from '../app/constant'

const buildResponse = (code: CODES, message: MESSAGES, data: any = {}) => {
  return { code, message, data }
}

export { buildResponse }
