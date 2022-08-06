import userEntity from "@/domain/entities/user-entity"
import { EditUser, findUserById, UUIDValidate } from "@/domain/usecases"
import EditUserController from "@/presentation/controllers/edit-user-controller"

const makeEditUser = (): EditUser => {
  class EditUserStub implements EditUser {
    async edit(userData: userEntity): Promise<{ body: userEntity }> {
      const user = {
        userId: 'valid_userId',
        accountId: 'new_valid_accountId',
        firstName: 'new_valid_firstName',
        lastName: 'new_valid_lastName',
        email: 'new_valid_email',
        groupId: 'new_valid_groupId',
      }

      return ({
        body: user
      })
    }
  }

  return new EditUserStub()
}

const makeUUIDValidate = (): UUIDValidate => {
  class UUIDValidateStub implements UUIDValidate {
    validate(uuid: string): { valid: boolean } {
      return ({ valid: true })
    }
  }

  return new UUIDValidateStub()
}

const makeUserIdExists = (): findUserById => {
  class UserIdExistsStub implements findUserById {
    async find(userId: string): Promise<{ body: userEntity }> {
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

const makeSut = () => {
  const editUser = makeEditUser()
  const uuidValidate = makeUUIDValidate()
  const userIdExists = makeUserIdExists()
  const sut = new EditUserController(editUser, uuidValidate, userIdExists)

  return ({
    sut,
    editUser,
    uuidValidate,
    userIdExists
  })
}

describe('Edit User', () => {
  it('Should call editUser with correct values', async () => {
    const { sut, editUser } = makeSut()

    const editUserSpy = jest.spyOn(editUser, 'edit')

    const httpRequest = {
      body: {
        userId: 'valid_userId',
        accountId: 'valid_accountId',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'valid_groupId',
      }
    }

    await sut.handle(httpRequest)

    expect(editUserSpy).toHaveBeenCalled()
    expect(editUserSpy).toBeCalledWith(httpRequest.body)
  })

  it('Should return status 204 and a edited user', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        userId: 'valid_userId',
        accountId: 'valid_accountId',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'valid_groupId',
      }
    }

    const expectedBody = {
      body: {
        userId: 'valid_userId',
        accountId: 'new_valid_accountId',
        firstName: 'new_valid_firstName',
        lastName: 'new_valid_lastName',
        email: 'new_valid_email',
        groupId: 'new_valid_groupId',
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.body).toEqual(expectedBody)
    expect(response.statusCode).toBe(204)
  })

  it('Should return status 500 if some dependency throw', async () => {
    const { sut, editUser } = makeSut()

    jest.spyOn(editUser, 'edit').mockImplementationOnce(() => { throw new Error() });

    const httpRequest = {
      body: {
        userId: 'invalid_userId',
        accountId: 'invalid_accountId',
        firstName: 'invalid_firstName',
        lastName: 'invalid_lastName',
        email: 'invalid_email',
        groupId: 'invalid_groupId',
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
        userId: 'valid_userId',
        accountId: 'valid_accountId',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'valid_groupId',
      }
    }

    await sut.handle(httpRequest)

    expect(uuidValidateSpy).toHaveBeenCalled()
    expect(uuidValidateSpy).toBeCalledWith(httpRequest.body.userId)
  })

  it('Should return a bad request if userIdValidate return false', async () => {
    const { sut, uuidValidate } = makeSut()

    jest.spyOn(uuidValidate, 'validate').mockReturnValue({ valid: false })

    const httpRequest = {
      body: {
        accountId: 'uuid_invalid',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('"userId" must be uuid')
  })

  it('Should call userIdExists with correct values', async () => {
    const { sut, userIdExists } = makeSut()

    const userIdExistsSpy = jest.spyOn(userIdExists, 'find')

    const httpRequest = {
      body: {
        userId: 'valid_userId',
        accountId: 'valid_accountId',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'valid_groupId',
      }
    }

    await sut.handle(httpRequest)

    expect(userIdExistsSpy).toHaveBeenCalled()
    expect(userIdExistsSpy).toBeCalledWith(httpRequest.body.userId)
  })

  it('Should return a bad request if user doesnt exists', async () => {
    const { sut, userIdExists } = makeSut()

    jest.spyOn(userIdExists, 'find').mockReturnValue({} as any)

    const httpRequest = {
      body: {
        accountId: 'uuid_invalid',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('"userId" doesn\'t exists')
  })
})