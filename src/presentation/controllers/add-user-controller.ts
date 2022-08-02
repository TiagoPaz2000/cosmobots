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
    const valid = this.validation.validate(request.body)
    if (valid) {
      return ({ statusCode: 400, body: { message: valid.message }})
    }

    const userId = this.generateUserId.generate()

    await this.addUser.add({ ...request.body, userId })
  }
}

export default AddUserController