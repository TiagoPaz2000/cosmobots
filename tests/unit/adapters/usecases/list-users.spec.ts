import ListAllUsers from "@/adapters/usecases/list-users"
import { ListUsersByQueryRepository, ListUsersRepository } from "@/data/protocols"
import UserEntity from "@/domain/entities/user-entity"

const userData = [{
  userId: 'valid_userId',
  accountId: 'valid_accountId',
  firstName: 'valid_firstName',
  lastName: 'valid_lastName',
  email: 'valid_email@mail.com',
  groupId: 'groupId_valid',
}]

interface IUserRepository extends ListUsersRepository, ListUsersByQueryRepository {}

const makeUserRepository = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async list(): Promise<UserEntity[]> {
      return userData
    }

    async listByQuery(query: { page: number }): Promise<UserEntity[]> {
      return userData
    }
  }

  return new UserRepositoryStub
}

const makeSut = () => {
  const userRepository = makeUserRepository()
  const sut = new ListAllUsers(userRepository, userRepository)

  return ({
    sut,
    userRepository
  })
}

describe('List Users', () => {
  it('Should call userRepository list with correct values', async () => {
    const { sut, userRepository } = makeSut()

    const userRepositorySpy = jest.spyOn(userRepository, 'list')

    const body = {
      page: 0
    }

    await sut.list(body)

    expect(userRepositorySpy).toBeCalledWith()
  })

  it('Should return user data if user repository returns', async () => {
    const { sut } = makeSut()

    const body = {
      page: 0
    }

    const response = await sut.list(body)

    expect(response).toEqual({ body: userData })
  })

  it('Should call userRepository listByQuery with correct values', async () => {
    const { sut, userRepository } = makeSut()

    const userRepositorySpy = jest.spyOn(userRepository, 'listByQuery')

    const body = {
      page: 1
    }

    await sut.list(body)

    expect(userRepositorySpy).toBeCalledWith(body)
  })
})