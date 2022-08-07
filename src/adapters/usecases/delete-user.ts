import { DeleteUserRepository } from '@/data/protocols'
import { DeleteUser } from '@/domain/usecases'

class DeleteUserAdapter implements DeleteUser {
  constructor(private deleteUserRepository: DeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository
  }
  async destroy(userId: string): Promise<void> {
    await this.deleteUserRepository.destroy(userId)
  }
}

export default DeleteUserAdapter