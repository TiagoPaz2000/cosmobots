import AddUserRepository from '@/data/protocols/add-user-repository'
import userEntity from '@/domain/entities/user-entity'
import { AddUser } from '@/domain/usecases'

class AddNewUser implements AddUser {
  constructor(private addUserRepository: AddUserRepository) {
    this.addUserRepository = addUserRepository
  }

  async add(userData: userEntity): Promise<{ body: userEntity }> {
    const response = await this.addUserRepository.create(userData)

    return ({ body: response })
  }
}

export default AddNewUser