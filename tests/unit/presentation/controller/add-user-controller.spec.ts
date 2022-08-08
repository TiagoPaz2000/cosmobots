import Group from '@/domain/entities/group-entity'
import UserEntity from '@/domain/entities/user-entity'
import { CheckUserData, AddUser, GenerateUUID, UUIDValidate } from '@/domain/usecases/'
import ListGroup from '@/domain/usecases/list-group'
import AddUserController from '@/presentation/controllers/add-user-controller'

const makeValidation = (): CheckUserData => {
  class ValidationUserStub implements CheckUserData {
    validate(userData: Omit<UserEntity, 'userId'>): { message: string } | undefined {
      return
    }
  }

  return new ValidationUserStub()
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

const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    async add(userData: UserEntity): Promise<{ body: UserEntity }> {
      return { body: userData }
    }
  }

  return new AddUserStub()
}

const makeGenerateUserId = (): GenerateUUID => {
  class GenerateUserIdStub implements GenerateUUID {
    generate(): string {
      return 'valid_userId'
    }
  }

  return new GenerateUserIdStub()
}

const makeUUIDValidate = (): UUIDValidate => {
  class UUIDValidateStub implements UUIDValidate {
    validate(uuid: { [key: string]: string }[]): (string | undefined)[] {
      return []
    }
  }

  return new UUIDValidateStub()
}

const makeSut = () => {
  const validation: CheckUserData = makeValidation()
  const addUser: AddUser = makeAddUser()
  const generateUserId: GenerateUUID = makeGenerateUserId()
  const groupExists = makeGroupExists()
  const uuidValidate = makeUUIDValidate()
  const sut = new AddUserController(validation, addUser, generateUserId, groupExists, uuidValidate)

  return ({
    sut,
    validation,
    addUser,
    generateUserId,
    groupExists,
    uuidValidate,
  })
}

describe('Add User Controller', () => {
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
      .toBeCalledWith([{ groupId: httpRequest.body.groupId }, { accountId: httpRequest.body.accountId }])
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
  
  it('Should return a bad request if check user data return an error', async () => {
    const { sut, validation } = makeSut()

    jest.spyOn(validation, 'validate').mockReturnValue({ message: '"accountId" must be uuid' })

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
    const { sut, validation } = makeSut()

    const validationSpy = jest.spyOn(validation, 'validate')

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

  it('Should call addUser with correct values', async () => {
    const { sut, addUser, generateUserId } = makeSut()

    const addUserSpy = jest.spyOn(addUser, 'add')

    const httpRequest = {
      body: {
        accountId: 'uuid_invalid',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const userId = generateUserId.generate()

    await sut.handle(httpRequest)

    expect(addUserSpy).toHaveBeenCalled()
    expect(addUserSpy).toBeCalledWith({ ...httpRequest.body, userId })
  })

  it('Should call GenerateUserId with correct values', async () => {
    const { sut, generateUserId } = makeSut()

    const addUserSpy = jest.spyOn(generateUserId, 'generate')

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

    expect(addUserSpy).toHaveBeenCalled()
    expect(addUserSpy).toBeCalledWith()
  })

  it('Should return status 201 and a created user', async () => {
    const { sut, generateUserId } = makeSut()

    const httpRequest = {
      body: {
        accountId: 'uuid_valid',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const userId = generateUserId.generate()

    const response = await sut.handle(httpRequest)

    expect(response.body).toEqual({ body: { ...httpRequest.body, userId } })
    expect(response.statusCode).toBe(201)
  })

  it('Should return status 500 if some dependency throw', async () => {
    const { sut, addUser } = makeSut()

    jest.spyOn(addUser, 'add').mockImplementationOnce(() => { throw new Error() });

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
    expect(response.statusCode).toBe(500)
    expect(response.body.message).toBe('internal server error')
  })
})