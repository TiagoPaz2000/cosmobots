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
      const userExists = await this.userExists.find(request.body.userId)
      if (!Object.keys(userExists).length) {
        return httpStatus.badRequest({ message: '"userId" doesn\'t exists' })
      }
      return httpStatus.noContent()
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default DeleteUserController