import { CheckUserData, AddUser, GenerateUUID, UUIDValidate } from '@/domain/usecases'
import ListGroup from '@/domain/usecases/list-group'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class AddUserController implements Controller {
  constructor(
    private validation: CheckUserData,
    private addUser: AddUser,
    private generateUserId: GenerateUUID,
    private groupExists: ListGroup,
    private uuidValidate: UUIDValidate,
  ) {
    this.validation = validation
    this.addUser = addUser
    this.groupExists = groupExists
    this.uuidValidate = uuidValidate
    this.groupExists = groupExists
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const valid = this.validation.validate(request.body)
      if (valid) {
        return httpStatus.badRequest({ message: valid.message })
      }

      const validUUID = this.uuidValidate
        .validate([{ groupId: request.body.groupId }, { accountId: request.body.accountId }])
      if (validUUID.length) {
        return httpStatus.badRequest({ message: validUUID })
      }

      const groupExists = await this.groupExists.find(request.body.groupId)
      if (!groupExists.body) {
        return httpStatus.badRequest({ message: '"groupId" doesn\'t exists'})
      }

      const userId = this.generateUserId.generate()

      const user = await this.addUser.add({ ...request.body, userId })

      return httpStatus.created(user)
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default AddUserController