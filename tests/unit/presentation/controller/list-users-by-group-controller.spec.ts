import groupEntity from "@/domain/entities/group-entity"
import ListGroup from "@/domain/usecases/list-group"
import ListUsersByGroupController from "@/presentation/controllers/list-users-by-groups-controller"

const makeGroupExists = (): ListGroup => {
  class GroupExistsStub implements ListGroup {
    async find(groupId: string): Promise<{ body: groupEntity | undefined }> {
      return ({
        body: {
          groupId: 'valid_groupId',
          groupName: 'valid_groupName',
          groupDescription: undefined
      }})
    }
  }

  return new GroupExistsStub
}

const makeSut = () => {
  const groupExists = makeGroupExists()
  const sut = new ListUsersByGroupController(groupExists)

  return ({
    sut,
    groupExists,
  })
}

describe('List User By Group Controller', () => {
  it('Should call groupExists with correct values', async () => {
    const { sut, groupExists } = makeSut()

    const listUserSpy = jest.spyOn(groupExists, 'find')

    const httpRequest = {
      body: {
        groupId: 'valid_groupId'
      }
    }

    await sut.handle(httpRequest)

    expect(listUserSpy).toHaveBeenCalled()
    expect(listUserSpy).toBeCalledWith(httpRequest.body.groupId)
  })

  it('Should return a bad request if groupExists return undefined', async () => {
    const { sut, groupExists } = makeSut()

    const httpRequest = {
      body: {
        groupId: 'valid_groupId'
      }
    }

    jest.spyOn(groupExists, 'find').mockResolvedValue({ body: undefined })

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('"groupId" doesn\'t exists')
  })
})