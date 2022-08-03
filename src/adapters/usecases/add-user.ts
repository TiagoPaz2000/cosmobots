import UserRepository from '@/data/protocols/user-repository'
import userEntity from '@/domain/entities/user-entity'
import { AddUser } from '@/domain/usecases'

class AddNewUser implements AddUser {
  constructor(private addUserRepository: UserRepository) {
    this.addUserRepository = addUserRepository
  }

  async add(userData: userEntity): Promise<{ body: userEntity }> {
    const response = await this.addUserRepository.create(userData)

    return ({ body: response })
  }
}

export default AddNewUser