import { genSaltSync, hashSync, compareSync } from 'bcryptjs'

const salt = genSaltSync(10)

const encryptPassword = (password: string) => {
  return hashSync(password, salt)
}

const comparePassword = (password: string, hash: string) => {
  return compareSync(password, hash)
}

export { encryptPassword, comparePassword }
