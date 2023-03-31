enum CODES {
  'Success' = 20000,
  'BadRequest' = 40000,
  'Expired' = 40001,
  'Forbidden' = 40003,
  'NotFound' = 40004,
  'ServerError' = 50000,
}

enum MESSAGES {
  'Success' = 'Success',
  'BadRequest' = 'Bad Request',
  'Expired' = 'Expired',
  'Forbidden' = 'Forbidden',
  'NotFount' = 'Not Found',
  'ServerError' = 'Internal Server Error',
}

export { CODES, MESSAGES }
