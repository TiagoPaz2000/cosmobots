import { EditUser, UUIDValidate, FindUserById, CheckUserData } from '@/domain/usecases/'
import httpStatus from '../helpers/http-status'
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
        return httpStatus.badRequest({ message: '"userId" must be uuid' })
      }

      const valid = this.validationData.validate(request.body)
      if (valid) {
        return httpStatus.badRequest({ message: valid.message })
      }

      const userExists = await this.userIdExists.find(request.body.userId)
      if (!Object.keys(userExists).length) {
        return httpStatus.badRequest({ message: '"userId" doesn\'t exists' })
      }

      const user = await this.editUser.edit(request.body)
      return httpStatus.created(user)
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default EditUserController