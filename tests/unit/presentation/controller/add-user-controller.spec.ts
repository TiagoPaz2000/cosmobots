import UserEntity from '@/domain/entities/user-entity'
import { CheckUserData, AddUser } from '@/domain/usecases/'
import AddUserController from '@/presentation/controllers/add-user-controller'

const makeValidationStub = (): CheckUserData => {
  class ValidationUser implements CheckUserData {
    validate(userData: Omit<UserEntity, 'id'>): { message: string } {
      return;
    }
  }

  return new ValidationUser;
}

const makeAddUserStub = (): AddUser => {
  class AddUser implements AddUser {
    async add(userData: UserEntity): Promise<{ body: UserEntity }> {
      return { body: userData };
    }
  }

  return new AddUser;
}

const makeSut = () => {
  const validation: CheckUserData = makeValidationStub();
  const addUser: AddUser = makeAddUserStub();
  const sut = new AddUserController(validation, addUser);

  return ({
    sut,
    validation,
    addUser,
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
    const { sut, addUser } = makeSut()

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

    const userId = 'valid_userId'

    await sut.handle(httpRequest)

    expect(addUserSpy).toHaveBeenCalled()
    expect(addUserSpy).toBeCalledWith({ ...httpRequest.body, userId })
  })
})