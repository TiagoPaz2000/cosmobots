import userEntity from '@/domain/entities/user-entity'
import CheckUserData from '@/domain/usecases/check-user-data'
import AddUserController from '@/presentation/controllers/add-user-controller'

const makeValidationStub = (): CheckUserData => {
  class ValidationUser implements CheckUserData {
    validate(userData: userEntity): { message: string } {
      return;
    }
  }

  return new ValidationUser;
}

const makeSut = () => {
  const validation: CheckUserData = makeValidationStub();
  const sut = new AddUserController(validation);

  return ({
    sut,
    validation
  })
}

describe('Add User Controller', () => {
  it('Should return a bad request if check user data return an error', async () => {
    const { sut, validation } = makeSut()

    jest.spyOn(validation, 'validate').mockReturnValue({ message: '"accountId" must be uuid' })

    const HttpRequest = {
      body: {
        accountId: 'uuid_invalid',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const response = await sut.handle(HttpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('"accountId" must be uuid')
  })

  it('Should call validation with correct args', async () => {
    const { sut, validation } = makeSut();

    const validationSpy = jest.spyOn(validation, 'validate')

    const HttpRequest = {
      body: {
        accountId: 'uuid_invalid',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    await sut.handle(HttpRequest);

    expect(validationSpy).toHaveBeenCalled();
    expect(validationSpy).toBeCalledWith(HttpRequest.body)
  })
})