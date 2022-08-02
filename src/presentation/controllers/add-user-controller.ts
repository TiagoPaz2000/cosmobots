import CheckUserData from '@/domain/usecases/check-user-data'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

class AddUserController implements Controller {
  constructor(private validation: CheckUserData ) {
    this.validation = validation
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    return ({ statusCode: 400, body: { message: '"accountId" must be uuid' }})
  }
}

export default AddUserController