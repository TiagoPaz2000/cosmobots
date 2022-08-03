import UserEntity from '@/domain/entities/user-entity'
import { CheckUserData, AddUser, GenerateUUID } from '@/domain/usecases/'
import AddUserController from '@/presentation/controllers/add-user-controller'

const makeValidationStub = (): CheckUserData => {
  class ValidationUser implements CheckUserData {
    validate(userData: Omit<UserEntity, 'userId'>): { message: string } | undefined {
      return
    }
  }

  return new ValidationUser
}

const makeAddUserStub = (): AddUser => {
  class AddUser implements AddUser {
    async add(userData: UserEntity): Promise<{ body: UserEntity }> {
      return { body: userData }
    }
  }

  return new AddUser
}

const makeGenerateUserId = (): GenerateUUID => {
  class GenerateUserId implements GenerateUUID {
    generate(): string {
      return 'valid_userId'
    }
  }

  return new GenerateUserId
}

const makeSut = () => {
  const validation: CheckUserData = makeValidationStub()
  const addUser: AddUser = makeAddUserStub()
  const generateUserId: GenerateUUID = makeGenerateUserId()
  const sut = new AddUserController(validation, addUser, generateUserId)

  return ({
    sut,
    validation,
    addUser,
    generateUserId,
  })
}

describe('Add User Controller', () => {
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
        accountId: 'uuid_invalid',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const userId = generateUserId.generate()

    const response = await sut.handle(httpRequest)

    expect(response.body).toEqual({ ...httpRequest.body, userId })
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