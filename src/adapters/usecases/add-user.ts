import AddUserRepository from '@/data/protocols/add-user-repository'
import UserEntity from '@/domain/entities/user-entity'
import { AddUser } from '@/domain/usecases'

class AddUserAdapter implements AddUser {
  constructor(private addUserRepository: AddUserRepository) {
    this.addUserRepository = addUserRepository
  }

  async add(userData: UserEntity): Promise<{ body: UserEntity }> {
    const response = await this.addUserRepository.create(userData)

    return ({ body: response })
  }
}

export default AddUserAdapter