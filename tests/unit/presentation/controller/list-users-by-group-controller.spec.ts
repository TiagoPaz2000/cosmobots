import ListUsersByGroupController from "@/presentation/controllers/list-users-by-groups-controller"
import { makeGroupExists, makeFindUsersByGroup, userData, makeUUIDValidate } from "../../mocks"

const makeSut = () => {
  const groupExists = makeGroupExists()
  const findUsersByGroup = makeFindUsersByGroup()
  const uuidValidate = makeUUIDValidate()
  const sut = new ListUsersByGroupController(groupExists, findUsersByGroup, uuidValidate)

  return ({
    sut,
    groupExists,
    findUsersByGroup,
    uuidValidate,
  })
}

describe('List Users By Group Controller', () => {
  it('Should call uuidValidate with correct values', async () => {
    const { sut, uuidValidate } = makeSut()

    const uuidValidateSpy = jest.spyOn(uuidValidate, 'validate')

    const httpRequest = {
      body: {
        groupId: 'valid_groupId'
      }
    }

    await sut.handle(httpRequest)

    expect(uuidValidateSpy).toHaveBeenCalled()
    expect(uuidValidateSpy)
      .toBeCalledWith([{ groupId: httpRequest.body.groupId }])
  })

  it('Should return a bad request if userIdValidate return false', async () => {
    const { sut, uuidValidate } = makeSut()

    jest.spyOn(uuidValidate, 'validate').mockReturnValue(['"groupId" must be a uuid'])

    const httpRequest = {
      body: {
        groupId: 'valid_groupId'
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual(['"groupId" must be a uuid'])
  })

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