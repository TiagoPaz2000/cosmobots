import { FindUsersByGroup, UUIDValidate } from '@/domain/usecases'
import ListGroup from '@/domain/usecases/list-group'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class ListUsersByGroupController implements Controller {
  constructor(private groupExists: ListGroup, private findUsersByGroup: FindUsersByGroup, private uuidValidate: UUIDValidate) {
    this.groupExists = groupExists
    this.findUsersByGroup = findUsersByGroup
    this.uuidValidate = uuidValidate
  }
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const validUUID = this.uuidValidate.validate([{ groupId: request.body.groupId }])
      if (validUUID.length) {
        return httpStatus.badRequest({ message: validUUID })
      }
      const groupExists = await this.groupExists.find(request.body.groupId)
      if (!groupExists.body) {
        return httpStatus.badRequest({ message: '"groupId" doesn\'t exists'})
      }
      const users = await this.findUsersByGroup.find(request.body.groupId)
      return httpStatus.ok(users)
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default ListUsersByGroupController