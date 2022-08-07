import { FindUserById } from '@/domain/usecases'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class DeleteUserController implements Controller {
  constructor(private userExists: FindUserById) {
    this.userExists = userExists
   }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      await this.userExists.find(request.body.userId)
      return httpStatus.noContent()
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default DeleteUserController