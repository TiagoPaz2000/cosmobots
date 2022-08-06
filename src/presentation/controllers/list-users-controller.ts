import { ListUsers } from '@/domain/usecases'
import { Controller } from '../protocols/controller'
import { HttpResponse } from '../protocols/http'

class ListUsersController implements Controller {
  constructor(private listUsers: ListUsers) {

  }
  async handle(): Promise<HttpResponse> {
    try {
      const { body } = await this.listUsers.list()
      return { body, statusCode: 200 }
    } catch (error) {
      const Error = error as Error
      return ({
        statusCode: 500,
        body: { message: 'internal server error', error: Error.message },
      })
    }
  }
}

export default ListUsersController