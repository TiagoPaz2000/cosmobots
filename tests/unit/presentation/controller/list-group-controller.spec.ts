import GroupEntity from "@/domain/entities/group-entity"
import { UUIDValidate } from "@/domain/usecases"
import ListGroup from "@/domain/usecases/list-group"
import ListGroupController from "@/presentation/controllers/list-group-controller"

const groupData: GroupEntity = {
  groupId: 'valid_groupId',
  groupName: 'valid_groupName',
  groupDescription: undefined
}

const makeUUIDValidate = (): UUIDValidate => {
  class UUIDValidateStub implements UUIDValidate {
    validate(uuid: string): { valid: boolean } {
      return ({ valid: true })
    }
  }

  return new UUIDValidateStub()
}

const makeListGroup = (): ListGroup => {
  class ListGroupStub implements ListGroup {
    async find(groupId: string): Promise<{ body: GroupEntity }> {
      return ({ body: groupData })
    }
  }

  return new ListGroupStub()
}

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
    expect(uuidValidateSpy).toBeCalledWith(groupData.groupId)
  })

  it('Should return a bad request if uuidValidate return false', async () => {
    const { sut, uuidValidate } = makeSut()

    jest.spyOn(uuidValidate, 'validate').mockReturnValue({ valid: false })

    const response = await sut.handle({ body: { groupId: groupData.groupId } })

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('"groupId" must be uuid')
  })
})