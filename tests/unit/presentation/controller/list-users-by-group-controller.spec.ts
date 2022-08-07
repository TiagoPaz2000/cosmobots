import GroupEntity from "@/domain/entities/group-entity"
import UserEntity from "@/domain/entities/user-entity"
import { FindUsersByGroup } from "@/domain/usecases"
import ListGroup from "@/domain/usecases/list-group"
import ListUsersByGroupController from "@/presentation/controllers/list-users-by-groups-controller"

const userData: UserEntity[] = [
  {
    userId: 'valid_userId',
    accountId: 'valid_accountId',
    firstName: 'valid_firstName',
    lastName: 'valid_lastName',
    email: 'valid_email',
    groupId: 'valid_groupId',
  }
]

const makeGroupExists = (): ListGroup => {
  class GroupExistsStub implements ListGroup {
    async find(groupId: string): Promise<{ body: GroupEntity | undefined }> {
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

const makeFindUsersByGroup = (): FindUsersByGroup => {
  class FindUsersByGroupStub implements FindUsersByGroup {
    async find(groupId: string): Promise<{ body: UserEntity[] }> {
      return { body: userData }
    }
  }

  return new FindUsersByGroupStub()
}

const makeSut = () => {
  const groupExists = makeGroupExists()
  const findUsersByGroup = makeFindUsersByGroup()
  const sut = new ListUsersByGroupController(groupExists, findUsersByGroup)

  return ({
    sut,
    groupExists,
    findUsersByGroup,
  })
}

describe('List Users By Group Controller', () => {
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

  it('Should call findUsersByGroup with correct values', async () => {
    const { sut, findUsersByGroup } = makeSut()

    const listUserSpy = jest.spyOn(findUsersByGroup, 'find')

    const httpRequest = {
      body: {
        groupId: 'valid_groupId'
      }
    }

    await sut.handle(httpRequest)

    expect(listUserSpy).toHaveBeenCalled()
    expect(listUserSpy).toBeCalledWith(httpRequest.body.groupId)
  })

  it('Should return status 200 and a listed users', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        groupId: 'valid_groupId'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.body).toEqual({ body: userData })
    expect(response.statusCode).toBe(200)
  })

  it('Should return status 200 and a empty array', async () => {
    const { sut, findUsersByGroup } = makeSut()

    jest.spyOn(findUsersByGroup, 'find').mockResolvedValue({ body: [] })

    const httpRequest = {
      body: {
        groupId: 'valid_groupId'
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.body).toEqual({ body: [] })
    expect(response.statusCode).toBe(200)
  })
})