import GenerateUUIDAdapter from "@/adapters/usecases/generate-uuid"
import * as uuid from 'uuid';
jest.mock('uuid');

const makeSut = () => {
  const sut = new GenerateUUIDAdapter()

  return ({
    sut
  })
}

describe('Generate UUID', () => {
  it('Should return a new uuid', () => {
    const { sut } = makeSut()
    
    const uuidSpy = jest.spyOn(uuid, 'v4').mockReturnValue('valid_id')

    const response = sut.generate()

    expect(uuidSpy).toHaveBeenCalled()
    expect(response).toBe('valid_id')
  })
})