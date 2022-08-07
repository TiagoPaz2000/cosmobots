import ListGroup from '@/domain/usecases/list-group'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class ListUsersByGroupController implements Controller {
  constructor(private groupExists: ListGroup) {
    this.groupExists = groupExists
  }
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const groupExists = await this.groupExists.find(request.body.groupId)
      if (!groupExists.body) {
        return httpStatus.badRequest({ message: '"groupId" doesn\'t exists'})
      }
      return httpStatus.ok({})
    } catch (error) {
      const { message } = error as Error
      return httpStatus.serverError(message)
    }
  }
}

export default ListUsersByGroupController