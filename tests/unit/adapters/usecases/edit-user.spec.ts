import EditUserAdapter from "@/adapters/usecases/edit-user"
import EditUserRepository from "@/data/protocols/edit-user-repository"
import UserEntity from "@/domain/entities/user-entity"

const userData = {
  userId: 'valid_userId',
  accountId: 'valid_accountId',
  firstName: 'valid_firstName',
  lastName: 'valid_lastName',
  email: 'valid_email@mail.com',
  groupId: 'groupId_valid',
}

const newUserData = {
  userId: 'valid_userId',
  accountId: 'new_valid_accountId',
  firstName: 'new_valid_firstName',
  lastName: 'new_valid_lastName',
  email: 'new_valid_email',
  groupId: 'new_valid_groupId',
}

const makeUserRepository = (): EditUserRepository => {
  class UserRepositoryStub implements EditUserRepository {
    async edit(userData: UserEntity): Promise<UserEntity> {
      return (newUserData)
    }
  }

  return new UserRepositoryStub
}

const makeSut = () => {
  const userRepository = makeUserRepository()
  const sut = new EditUserAdapter(userRepository)

  return ({
    sut,
    userRepository
  })
}

describe('Edit User', () => {
  it('Should call userRepository with correct values', async () => {
    const { sut, userRepository } = makeSut()

    const userRepositorySpy = jest.spyOn(userRepository, 'edit')

    await sut.edit(userData)

    expect(userRepositorySpy).toBeCalledWith(userData)
  })

  it('Should return user data if user repository returns', async () => {
    const { sut } = makeSut()

    const response = await sut.edit(userData)

    expect(response).toEqual({ body: newUserData })
  })
})