import ValidationUser from "@/adapters/usecases/validation-user"
import userSchemaValidate from "@/adapters/helpers/user-schema-validate"

const makeUserSchemaValidate = () => {
  const userSchemaValidate = () => {
    return ({
      safeParse: (): any => { valid: { success: 'success' } }
    })
  }

  return userSchemaValidate()
}

const makeSut = () => {
  const userSchema = userSchemaValidate()
  const sut = new ValidationUser(userSchema as any);

  return ({
    sut,
    userSchema
  })
}

describe('ValidationUser', () => {
  it('Should return an undefined on success', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        accountId: 'valid_accountId',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const response = sut.validate(httpRequest.body as any)

    expect(response).toBe(undefined)
  })

  it('Should return an error message if accountId has incorrect format', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const response = sut.validate(httpRequest.body as any)

    expect(response?.message).toBe('"accountId" is required')
  })

  it('Should return an error message if accountId has incorrect type', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        accountId: 1,
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const response = sut.validate(httpRequest.body as any)

    expect(response?.message).toBe('"accountId" must be a string')
  })
})