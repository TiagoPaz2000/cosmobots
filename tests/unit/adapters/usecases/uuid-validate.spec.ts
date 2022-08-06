import UUIDValidateAdapter from "@/adapters/usecases/uuid-validate"
import UUIDValidator from "@/infra/protocols/uuid-validator"

const data = { uuidArg: 'valid_uuid' }

const makeUUIDValidator = (): UUIDValidator => {
  class UUIDValidatorStub implements UUIDValidator {
    validate(uuid: string): boolean {
      return true
    }
  }

  return new UUIDValidatorStub()
}

const makeSut = () => {
  const uuidValidator = makeUUIDValidator();
  const sut = new UUIDValidateAdapter(uuidValidator)

  return ({
    sut,
    uuidValidator
  })
}

describe('UUID Validate', () => {
  it('Should call uuidValidator with correct values', () => {
    const { sut, uuidValidator } = makeSut()

    const userRepositorySpy = jest.spyOn(uuidValidator, 'validate')

    sut.validate(data.uuidArg)

    expect(userRepositorySpy).toBeCalledWith(data.uuidArg)
  })

  it('Should return true if uuidValidator returns true', () => {
    const { sut } = makeSut()

    const response = sut.validate(data.uuidArg)

    expect(response).toEqual({ valid: true })
  })

  it('Should return false if uuidValidator returns false', () => {
    const { sut, uuidValidator } = makeSut()

    jest.spyOn(uuidValidator, 'validate').mockReturnValue(false)

    const response = sut.validate(data.uuidArg)

    expect(response).toEqual({ valid: false })
  })
})