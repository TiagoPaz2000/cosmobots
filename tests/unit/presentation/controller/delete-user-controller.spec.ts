import UserEntity from '@/domain/entities/user-entity';
import { FindUserById, UUIDValidate } from '@/domain/usecases';
import DeleteUserController from '@/presentation/controllers/delete-user-controller';

const makeUserIdExists = (): FindUserById => {
  class UserIdExistsStub implements FindUserById {
    async find(userId: string): Promise<{ body: UserEntity }> {
      return ({
        body: {
          userId: 'valid_userId',
          accountId: 'valid_accountId',
          firstName: 'valid_firstName',
          lastName: 'valid_lastName',
          email: 'valid_email',
          groupId: 'valid_groupId',
        }
      })
    }
  }

  return new UserIdExistsStub()
}

const makeUUIDValidate = (): UUIDValidate => {
  class UUIDValidateStub implements UUIDValidate {
    validate(uuid: string): { valid: boolean } {
      return ({ valid: true })
    }
  }

  return new UUIDValidateStub()
}

const makeSut = () => {
  const uuidValidate = makeUUIDValidate()
  const userExists = makeUserIdExists()
  const sut = new DeleteUserController(userExists, uuidValidate);

  return ({
    sut,
    userExists,
    uuidValidate,
  })
}

describe('Delete User Controller', () => {
  it('Should call userExists with correct values', async () => {
    const { sut, userExists } = makeSut()

    const userExistsSpy = jest.spyOn(userExists, 'find')

    const httpRequest = {
      body: {
        userId: 'valid_userId'
      }
    }

    await sut.handle(httpRequest)

    expect(userExistsSpy).toBeCalled()
    expect(userExistsSpy).toBeCalledWith(httpRequest.body.userId)
  })

  it('Should return a bad request if user doesnt exists', async () => {
    const { sut, userExists } = makeSut()

    jest.spyOn(userExists, 'find').mockReturnValue({} as any)

    const httpRequest = {
      body: {
        userId: 'valid_userId'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('"userId" doesn\'t exists')
  })

  it('Should return status 500 if some dependency throws', async () => {
    const { sut, userExists } = makeSut()

    jest.spyOn(userExists, 'find').mockImplementationOnce(() => { throw new Error() })

    const httpRequest = {
      body: {
        userId: 'valid_userId'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(500)
    expect(response.body.message).toBe('internal server error')
  })

  it('Should call uuidValidate with correct values', async () => {
    const { sut, uuidValidate } = makeSut()

    const uuidValidateSpy = jest.spyOn(uuidValidate, 'validate')

    const httpRequest = {
      body: {
        userId: 'valid_userId'
      }
    }

    await sut.handle(httpRequest)

    expect(uuidValidateSpy).toHaveBeenCalled()
    expect(uuidValidateSpy).toBeCalledWith(httpRequest.body.userId)
  })
})