/* eslint-disable @typescript-eslint/no-explicit-any */
const httpStatus = {
  badRequest: (body: any) => {
    return ({ statusCode: 400, body })
  },
  ok: (body: any) => {
    return ({ statusCode: 200, body })
  },
  created: (body: any) => {
    return ({ statusCode: 201, body })
  },
  noContent: () => {
    return ({ statusCode: 204, body: {} })
  },
  serverError: (error: string) => {
    return ({ statusCode: 500, body: { message: 'internal server error', error } })
  },
}

export default httpStatus