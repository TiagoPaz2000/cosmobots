import { ListUsers } from '@/domain/usecases'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class ListUsersController implements Controller {
  constructor(private listUsers: ListUsers) {

  }
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const users = await this.listUsers
        .list({ page: Number(request.body.page) })
      return httpStatus.ok(users)
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default ListUsersController