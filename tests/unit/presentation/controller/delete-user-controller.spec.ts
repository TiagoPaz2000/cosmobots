import DeleteUserController from '@/presentation/controllers/delete-user-controller';
import {
  makeUUIDValidate,
  makeDeleteUser,
  makeUserIdExists,
} from '../../mocks'

const makeSut = () => {
  const uuidValidate = makeUUIDValidate()
  const userExists = makeUserIdExists()
  const deleteUser = makeDeleteUser()
  const sut = new DeleteUserController(userExists, uuidValidate, deleteUser);

  return ({
    sut,
    userExists,
    uuidValidate,
    deleteUser,
  })
}

describe('Delete User Controller', () => {
  it('Should call deleteUser with correct values', async () => {
    const { sut, deleteUser } = makeSut()

    const userExistsSpy = jest.spyOn(deleteUser, 'destroy')

    const httpRequest = {
      body: {
        userId: 'valid_userId'
      }
    }

    await sut.handle(httpRequest)

    expect(userExistsSpy).toBeCalled()
    expect(userExistsSpy).toBeCalledWith(httpRequest.body.userId)
  })

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
    expect(uuidValidateSpy).toBeCalledWith([{ userId: httpRequest.body.userId }])
  })

  it('Should return a bad request if userIdValidate return false', async () => {
    const { sut, uuidValidate } = makeSut()

    jest.spyOn(uuidValidate, 'validate').mockReturnValue(['"userId" must be uuid'])

    const httpRequest = {
      body: {
        userId: 'invalid_userId'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual(['"userId" must be uuid'])
  })
})