import { UUIDValidate } from '@/domain/usecases'
import ListGroup from '@/domain/usecases/list-group'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class ListGroupController implements Controller {
  constructor(private listGroup: ListGroup, private uuidValidate: UUIDValidate) {
    this.listGroup = listGroup
  }
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const validUUID = this.uuidValidate.validate([{ groupId: request.body.groupId }])
      if (validUUID.length) {
        return httpStatus.badRequest({ message: validUUID })
      }
      const group = await this.listGroup.find(request.body.groupId)
      return httpStatus.ok(group)
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default ListGroupController