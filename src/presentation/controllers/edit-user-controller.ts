import { EditUser, UUIDValidate, FindUserById, CheckUserData } from '@/domain/usecases/'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class EditUserController implements Controller {
  constructor(private editUser: EditUser,
    private uuidValidate: UUIDValidate,
    private userIdExists: FindUserById,
    private validationData: CheckUserData,
  ) {
    this.editUser = editUser
    this.userIdExists = userIdExists
    this.uuidValidate = uuidValidate
    this.validationData = validationData
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const validUserId = this.uuidValidate.validate(request.body.userId)
      if (!validUserId.valid) {
        return ({ body: { message: '"userId" must be uuid' }, statusCode: 400 })
      }

      const valid = this.validationData.validate(request.body)
      if (valid) {
        return ({ statusCode: 400, body: { message: valid.message }})
      }

      const userExists = await this.userIdExists.find(request.body.userId)
      if (!Object.keys(userExists).length) {
        return ({ body: { message: '"userId" doesn\'t exists' }, statusCode: 400 })
      }

      const user = await this.editUser.edit(request.body)
      return ({ body: user, statusCode: 201 })
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