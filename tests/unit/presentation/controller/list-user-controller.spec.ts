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

    await sut.handle()

    expect(listUserSpy).toHaveBeenCalled()
    expect(listUserSpy).toBeCalledWith()
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

    const response = await sut.handle()

    expect(response.body).toEqual({ body: expectedBody.body })
    expect(response.statusCode).toBe(200)
  })

  it('Should return status 500 if some dependency throw', async () => {
    const { sut, listUsers } = makeSut()

    jest.spyOn(listUsers, 'list').mockImplementationOnce(() => { throw new Error() });

    const response = await sut.handle()
    expect(response.statusCode).toBe(500)
    expect(response.body.message).toBe('internal server error')
  })
})