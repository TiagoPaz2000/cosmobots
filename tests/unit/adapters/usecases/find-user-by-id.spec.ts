import FindUserByIdAdapter from "@/adapters/usecases/find-user"
import { FindUserByIdRepository } from "@/data/protocols"
import UserEntity from "@/domain/entities/user-entity"

const userData = {
  userId: 'valid_userId',
  accountId: 'valid_accountId',
  firstName: 'valid_firstName',
  lastName: 'valid_lastName',
  email: 'valid_email@mail.com',
  groupId: 'groupId_valid',
}

const makeUserRepository = (): FindUserByIdRepository => {
  class UserRepositoryStub implements FindUserByIdRepository {
    async find(userId: UserEntity['userId']): Promise<UserEntity> {
      return (userData)
    }
  }

  return new UserRepositoryStub
}

const makeSut = () => {
  const userRepository = makeUserRepository()
  const sut = new FindUserByIdAdapter(userRepository)

  return ({
    sut,
    userRepository
  })
}

describe('Find User By Id', () => {
  it('Should call userRepository with correct values', async () => {
    const { sut, userRepository } = makeSut()

    const userRepositorySpy = jest.spyOn(userRepository, 'find')

    await sut.find(userData.userId)

    expect(userRepositorySpy).toBeCalledWith(userData.userId)
  })

  it('Should return user data if user repository returns', async () => {
    const { sut } = makeSut()

    const response = await sut.find(userData.userId)

    expect(response).toEqual({ body: userData })
  })
})