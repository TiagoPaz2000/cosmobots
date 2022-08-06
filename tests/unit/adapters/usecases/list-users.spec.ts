import ListAllUsers from "@/adapters/usecases/list-users"
import { ListUsersRepository } from "@/data/protocols"
import UserEntity from "@/domain/entities/user-entity"

const userData = [{
  userId: 'valid_userId',
  accountId: 'valid_accountId',
  firstName: 'valid_firstName',
  lastName: 'valid_lastName',
  email: 'valid_email@mail.com',
  groupId: 'groupId_valid',
}]

const makeUserRepository = (): ListUsersRepository => {
  class UserRepository implements ListUsersRepository {
    async list(): Promise<UserEntity[]> {
      return userData
    }
  }

  return new UserRepository
}

const makeSut = () => {
  const userRepository = makeUserRepository()
  const sut = new ListAllUsers(userRepository)

  return ({
    sut,
    userRepository
  })
}

describe('List Users', () => {
  it('Should call userRepository with correct values', async () => {
    const { sut, userRepository } = makeSut()

    const userRepositorySpy = jest.spyOn(userRepository, 'list')

    await sut.list()

    expect(userRepositorySpy).toBeCalledWith()
  })

  it('Should return user data if user repository returns', async () => {
    const { sut } = makeSut()

    const response = await sut.list()

    expect(response).toEqual({ body: userData })
  })
})