import { FindUsersByGroup } from '@/domain/usecases'
import ListGroup from '@/domain/usecases/list-group'
import httpStatus from '../helpers/http-status'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class ListUsersByGroupController implements Controller {
  constructor(private groupExists: ListGroup, private findUsersByGroup: FindUsersByGroup) {
    this.groupExists = groupExists
    this.findUsersByGroup = findUsersByGroup
  }
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
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