import { EditUser, UUIDValidate, UserIdExists } from '@/domain/usecases/'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class EditUserController implements Controller {
  constructor(private editUser: EditUser,
    // private uuidValidate: UUIDValidate,
    // private userIdExists: UserIdExists,
  ) {
    this.editUser = editUser
    // this.userIdExists = userIdExists
    // this.uuidValidate = uuidValidate
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const user = await this.editUser.edit(request.body)
      return ({ body: user, statusCode: 204 })
    } catch (error) {
      const Error = error as Error
      return ({
        statusCode: 500,
        body: { message: 'internal server error', error: Error.message },
      })
    }
  }
}

export default EditUserController