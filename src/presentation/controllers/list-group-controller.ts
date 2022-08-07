import ListGroup from '@/domain/usecases/list-group'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class ListGroupController implements Controller {
  constructor(private listGroup: ListGroup) {
    this.listGroup = listGroup
  }
  async handle(request: HttpRequest): Promise<HttpResponse> {
    await this.listGroup.find(request.body.groupId)
    return httpStatus.ok({})
  }
}

export default ListGroupController