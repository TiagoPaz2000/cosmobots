import { CheckUserData, AddUser, GenerateUUID } from '@/domain/usecases'
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
        return ({ statusCode: 400, body: { message: valid.message }})
      }

      const userId = this.generateUserId.generate()

      const user = await this.addUser.add({ ...request.body, userId })

      return ({ statusCode: 201, body: user.body })
    } catch (error) {
      return ({
        statusCode: 500,
        body: { message: 'internal server error', error: error.message },
      })
    }
  }
}

export default AddUserController