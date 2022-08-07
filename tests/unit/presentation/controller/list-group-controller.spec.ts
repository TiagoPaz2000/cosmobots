import GroupEntity from "@/domain/entities/group-entity"
import ListGroup from "@/domain/usecases/list-group"
import ListGroupController from "@/presentation/controllers/list-group-controller"

const groupData: GroupEntity = {
  groupId: 'valid_groupId',
  groupName: 'valid_groupName',
  groupDescription: undefined
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
  const sut = new ListGroupController(lisGroup)

  return ({
    sut,
    lisGroup,
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
})