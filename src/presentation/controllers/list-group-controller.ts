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
    this.uuidValidate.validate(request.body.groupId)
    const group = await this.listGroup.find(request.body.groupId)
    return httpStatus.ok(group)
  }
}

export default ListGroupController