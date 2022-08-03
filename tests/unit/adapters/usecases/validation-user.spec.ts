import ValidationUser from "@/adapters/usecases/validation-user"

const makeUserSchemaValidate = () => {
  const userSchemaValidate = () => {
    return ({
      safeParse: (): any => { valid: { success: 'success' } }
    })
  }

  return userSchemaValidate()
}

const makeSut = () => {
  const userSchema = makeUserSchemaValidate()
  const sut = new ValidationUser(userSchema as any);

  return ({
    sut,
    userSchema
  })
}

describe('ValidationUser', () => {
  it('Should return an error message if accountId has incorrect format', () => {
    const { sut, userSchema } = makeSut()
    jest.spyOn(userSchema, 'safeParse')
      .mockReturnValue({ error: { message: '"accountId" is required' } })

    const httpRequest = {
      body: {
        accountId: 'uuid_invalid',
        firstName: 'valid_firstName',
        lastName: 'valid_lastName',
        email: 'valid_email',
        groupId: 'uuid_valid',
      }
    }

    const response = sut.validate(httpRequest.body)

    expect(response?.message).toBe('"accountId" is required')
  })
})