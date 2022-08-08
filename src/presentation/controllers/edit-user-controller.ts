import { EditUser, UUIDValidate, FindUserById, CheckUserData } from '@/domain/usecases/'
import ListGroup from '@/domain/usecases/list-group'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class EditUserController implements Controller {
  constructor(private editUser: EditUser,
    private uuidValidate: UUIDValidate,
    private userIdExists: FindUserById,
    private validationData: CheckUserData,
    private groupExists: ListGroup,
  ) {
    this.editUser = editUser
    this.userIdExists = userIdExists
    this.uuidValidate = uuidValidate
    this.validationData = validationData
    this.groupExists = groupExists
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const validUUID = this.uuidValidate
        .validate([{ userId: request.body.userId }, { groupId: request.body.groupId }, { accountId: request.body.accountId }])
      if (validUUID.length) {
        return httpStatus.badRequest({ message: validUUID })
      }

      const valid = this.validationData.validate(request.body)
      if (valid) {
        return httpStatus.badRequest({ message: valid.message })
      }

      const groupExists = await this.groupExists.find(request.body.groupId)
      if (!groupExists.body) {
        return httpStatus.badRequest({ message: '"groupId" doesn\'t exists'})
      }

      const userExists = await this.userIdExists.find(request.body.userId)
      if (!userExists.body) {
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