import AddNewUser from "@/adapters/usecases/add-user"
import IUserRepository from "@/data/protocols/user-repository"
import userEntity from "@/domain/entities/user-entity"

const userData = {
  userId: 'valid_userId',
  accountId: 'valid_accountId',
  firstName: 'valid_firstName',
  lastName: 'valid_lastName',
  email: 'valid_email@mail.com',
  groupId: 'groupId_valid',
}

const makeUserRepository = (): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async create(userData: userEntity): Promise<userEntity> {
      return userData
    }
  }

  return new UserRepositoryStub
}

const makeSut = () => {
  const userRepository = makeUserRepository()
  const sut = new AddNewUser(userRepository)

  return ({
    sut,
    userRepository
  })
}

describe('Add User', () => {
  it('Should call userRepository with correct values', async () => {
    const { sut, userRepository } = makeSut()

    const userRepositorySpy = jest.spyOn(userRepository, 'create')

    await sut.add(userData)

    expect(userRepositorySpy).toBeCalledWith(userData)
  })

  it('Should return user data if user repository returns', async () => {
    const { sut } = makeSut()

    const response = await sut.add(userData)

    expect(response).toEqual({ body: userData })
  })
})