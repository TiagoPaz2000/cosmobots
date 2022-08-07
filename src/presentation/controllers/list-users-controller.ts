import { ListUsers } from '@/domain/usecases'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpResponse } from '../protocols/http'

class ListUsersController implements Controller {
  constructor(private listUsers: ListUsers) {

  }
  async handle(): Promise<HttpResponse> {
    try {
      const { body } = await this.listUsers.list()
      return httpStatus.ok(body)
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default ListUsersController