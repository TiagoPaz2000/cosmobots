import EditUserRepository from '@/data/protocols/edit-user-repository'
import UserEntity from '@/domain/entities/user-entity'
import { EditUser } from '@/domain/usecases'

class EditUserAdapter implements EditUser {
  constructor(private editUserRepository: EditUserRepository) {
    this.editUserRepository = editUserRepository
  }

  async edit(userData: UserEntity): Promise<{ body: UserEntity; }> {
    const response = await this.editUserRepository.edit(userData)

    return ({ body: response })
  }
}

export default EditUserAdapter