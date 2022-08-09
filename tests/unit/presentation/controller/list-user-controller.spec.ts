import ListUsersController from '@/presentation/controllers/list-users-controller'
import { makeListUsers } from '../../mocks'

const makeSut = () => {
  const listUsers = makeListUsers()
  const sut = new ListUsersController(listUsers)

  return ({
    sut,
    listUsers,
  })
}

describe('List Users Controller', () => {
  it('Should call addUser with correct values', async () => {
    const { sut, listUsers } = makeSut()

    const listUserSpy = jest.spyOn(listUsers, 'list')

    const httpRequest = {
      body: {
        page: 1
      }
    }

    await sut.handle(httpRequest)

    expect(listUserSpy).toHaveBeenCalled()
    expect(listUserSpy).toBeCalledWith({ page: httpRequest.body.page })
  })

  it('Should return status 200 and a listed users', async () => {
    const { sut } = makeSut()

    const expectedBody = { body: [
        {
          userId: 'valid_userId',
          accountId: 'valid_accountId',
          firstName: 'valid_firstName',
          lastName: 'valid_lastName',
          email: 'valid_email',
          groupId: 'valid_groupId',
        }
      ]
    }

    const httpRequest = {
      body: {
        page: 0
      }
    }

    const response = await sut.handle(httpRequest)

    expect(response.body).toEqual({ body: expectedBody.body })
    expect(response.statusCode).toBe(200)
  })

  it('Should return status 500 if some dependency throw', async () => {
    const { sut, listUsers } = makeSut()

    jest.spyOn(listUsers, 'list').mockImplementationOnce(() => { throw new Error() });

    const httpRequest = {
      body: {
        page: 0
      }
    }

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(500)
    expect(response.body.message).toBe('internal server error')
  })
})