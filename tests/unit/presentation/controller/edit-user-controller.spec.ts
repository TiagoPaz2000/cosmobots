import Group from "@/domain/entities/group-entity"
import UserEntity from "@/domain/entities/user-entity"
import { CheckUserData, EditUser, FindUserById, UUIDValidate } from "@/domain/usecases"
import ListGroup from "@/domain/usecases/list-group"
import EditUserController from "@/presentation/controllers/edit-user-controller"

const makeEditUser = (): EditUser => {
  class EditUserStub implements EditUser {
    async edit(userData: UserEntity): Promise<{ body: UserEntity }> {
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

const makeGroupExists = (): ListGroup => {
  class GroupExistsStub implements ListGroup {
    async find(groupId: string): Promise<{ body: Group | undefined }> {
      return ({
        body: {
          groupId: 'valid_groupId',
          groupName: 'valid_groupName',
          groupDescription: undefined
      }})
    }
  }

  return new GroupExistsStub
}

const makeUUIDValidate = (): UUIDValidate => {
  class UUIDValidateStub implements UUIDValidate {
    validate(uuid: { [key: string]: string }[]): (string | undefined)[] {
      return []
    }
  }

  return new UUIDValidateStub()
}

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

const makeValidation = (): CheckUserData => {
  class ValidationDataStub implements CheckUserData {
    validate(userData: Omit<UserEntity, 'userId'>): { message: string } | undefined {
      return
    }
  }

  return new ValidationDataStub()
}

const makeSut = () => {
  const editUser = makeEditUser()
  const uuidValidate = makeUUIDValidate()
  const userIdExists = makeUserIdExists()
  const validationData = makeValidation()
  const groupExists = makeGroupExists()
  const sut = new EditUserController(editUser, uuidValidate, userIdExists, validationData, groupExists)

  return ({
    sut,
    editUser,
    uuidValidate,
    userIdExists,
    validationData,
    groupExists
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
    expect(response.statusCode).toBe(201)
  })

  it('Should call groupExists with correct values', async () => {
    const { sut, groupExists } = makeSut()

    const listUserSpy = jest.spyOn(groupExists, 'find')

    const httpRequest = {
      body: {
        groupId: 'valid_groupId'
      }
    }

    await sut.handle(httpRequest)

    expect(listUserSpy).toHaveBeenCalled()
    expect(listUserSpy).toBeCalledWith(httpRequest.body.groupId)
  })

  it('Should return a bad request if groupExists return undefined', async () => {
    const { sut, groupExists } = makeSut()

    const httpRequest = {
      body: {
        groupId: 'valid_groupId'
      }
    }

    jest.spyOn(groupExists, 'find').mockResolvedValue({ body: undefined })

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('"groupId" doesn\'t exists')
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
    expect(uuidValidateSpy)
      .toBeCalledWith([{ userId: httpRequest.body.userId }, { groupId: httpRequest.body.groupId }, { accountId: httpRequest.body.accountId }])
  })

  it('Should return a bad request if userIdValidate return false', async () => {
    const { sut, uuidValidate } = makeSut()

    jest.spyOn(uuidValidate, 'validate').mockReturnValue(['"accountId" must be a uuid'])

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
    expect(response.body.message).toEqual(['"accountId" must be a uuid'])
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

  it('Should return a bad request if check user data return an error', async () => {
    const { sut, validationData } = makeSut()

    jest.spyOn(validationData, 'validate').mockReturnValue({ message: '"accountId" must be uuid' })

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
    expect(response.body.message).toBe('"accountId" must be uuid')
  })

  it('Should call validation with correct args', async () => {
    const { sut, validationData } = makeSut()

    const validationSpy = jest.spyOn(validationData, 'validate')

    const httpRequest = {
      body: {
        accountId: 'uuid_invalid',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    await sut.handle(httpRequest)

    expect(validationSpy).toHaveBeenCalled()
    expect(validationSpy).toBeCalledWith(httpRequest.body)
  })
})