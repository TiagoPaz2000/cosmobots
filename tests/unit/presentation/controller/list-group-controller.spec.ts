import ListGroupController from "@/presentation/controllers/list-group-controller"
import {
  makeUUIDValidate,
  makeListGroup,
  groupData,
} from "../../mocks"

const makeSut = () => {
  const lisGroup = makeListGroup()
  const uuidValidate = makeUUIDValidate()
  const sut = new ListGroupController(lisGroup, uuidValidate)

  return ({
    sut,
    lisGroup,
    uuidValidate,
  })
}

describe('List Group Controller', () => {
  it('Should call listGroup with correct values', async () => {
    const { sut, lisGroup } = makeSut()

    const listGroupSpy = jest.spyOn(lisGroup, 'find')

    await sut.handle({ body: { groupId: groupData.groupId } })

    expect(listGroupSpy).toHaveBeenCalled()
    expect(listGroupSpy).toBeCalledWith(groupData.groupId)
  })

  it('Should return status 200 and a listed group', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({ body: { groupId: groupData.groupId } })

    expect(response.body).toEqual({ body: groupData })
    expect(response.statusCode).toBe(200)
  })

  it('Should call uuidValidate with correct values', async () => {
    const { sut, uuidValidate } = makeSut()

    const uuidValidateSpy = jest.spyOn(uuidValidate, 'validate')

    await sut.handle({ body: { groupId: groupData.groupId } })

    expect(uuidValidateSpy).toHaveBeenCalled()
    expect(uuidValidateSpy).toBeCalledWith([{ groupId: groupData.groupId }])
  })

  it('Should return a bad request if uuidValidate return false', async () => {
    const { sut, uuidValidate } = makeSut()

    jest.spyOn(uuidValidate, 'validate').mockReturnValue(['"groupId" must be uuid'])

    const response = await sut.handle({ body: { groupId: groupData.groupId } })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual(['"groupId" must be uuid'])
  })

  it('Should return status 500 if some dependency throw', async () => {
    const { sut, uuidValidate } = makeSut()

    jest.spyOn(uuidValidate, 'validate').mockImplementationOnce(() => { throw new Error() });

    const response = await sut.handle({ body: { groupId: groupData.groupId } })
    
    expect(response.statusCode).toBe(500)
    expect(response.body.message).toBe('internal server error')
  })
})