import UserEntity from '@/domain/entities/user-entity';
import { FindUserById } from '@/domain/usecases';
import DeleteUserController from '@/presentation/controllers/delete-user-controller';

const makeUserIdExists = (): FindUserById => {
  class UserIdExistsStub implements FindUserById {
    async find(userId: string): Promise<{ body: UserEntity }> {
      return ({
        body: {
          userId: 'valid_userId',
          accountId: 'valid_accountId',
          firstName: 'valid_firstName',
          lastName: 'valid_lastName',
          email: 'valid_email',
          groupId: 'valid_groupId',
        }
      })
    }
  }

  return new UserIdExistsStub()
}

const makeSut = () => {
  const userExists = makeUserIdExists()
  const sut = new DeleteUserController(userExists);

  return ({
    sut,
    userExists,
  })
}

describe('Delete User Controller', () => {
  it('Should call userExists with correct values', async () => {
    const { sut, userExists } = makeSut()

    const userExistsSpy = jest.spyOn(userExists, 'find')

    const httpRequest = {
      body: {
        userId: 'valid_userId'
      }
    }

    await sut.handle(httpRequest)

    expect(userExistsSpy).toBeCalled()
    expect(userExistsSpy).toBeCalledWith(httpRequest.body.userId)
  })
})