import AddNewUser from "@/adapters/usecases/add-user"
import DeleteUserAdapter from "@/adapters/usecases/delete-user"
import { DeleteUserRepository } from "@/data/protocols"
import AddUserRepository from "@/data/protocols/add-user-repository"
import UserEntity from "@/domain/entities/user-entity"

const userData = {
  userId: 'valid_userId',
}

const makeUserRepository = (): DeleteUserRepository => {
  class UserRepositoryStub implements DeleteUserRepository {
    async destroy(userId: UserEntity['userId']): Promise<void> {}
  }

  return new UserRepositoryStub
}

const makeSut = () => {
  const userRepository = makeUserRepository()
  const sut = new DeleteUserAdapter(userRepository)

  return ({
    sut,
    userRepository
  })
}

describe('Add User', () => {
  it('Should call userRepository with correct values', async () => {
    const { sut, userRepository } = makeSut()

    const userRepositorySpy = jest.spyOn(userRepository, 'destroy')

    await sut.destroy(userData.userId)

    expect(userRepositorySpy).toBeCalledWith(userData.userId)
  })

  it('Should return undefined data if user repository returns void', async () => {
    const { sut } = makeSut()

    const response = await sut.destroy(userData.userId)
    
    expect(response).toEqual(undefined)
  })
})