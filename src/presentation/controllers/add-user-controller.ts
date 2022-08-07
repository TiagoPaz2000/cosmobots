import { CheckUserData, AddUser, GenerateUUID } from '@/domain/usecases'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class AddUserController implements Controller {
  constructor(
    private validation: CheckUserData,
    private addUser: AddUser,
    private generateUserId: GenerateUUID,
  ) {
    this.validation = validation
    this.addUser = addUser
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const valid = this.validation.validate(request.body)
      if (valid) {
        return httpStatus.badRequest({ message: valid.message })
      }

      const userId = this.generateUserId.generate()

      const user = await this.addUser.add({ ...request.body, userId })

      return httpStatus.created(user.body)
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default AddUserController