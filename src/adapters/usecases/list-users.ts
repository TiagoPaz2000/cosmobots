import { ListUsersRepository } from '@/data/protocols'
import UserEntity from '@/domain/entities/user-entity'
import { ListUsers } from '@/domain/usecases'

class ListUsersAdapter implements ListUsers {
  constructor(private listUsersRepository: ListUsersRepository) {
    this.listUsersRepository = listUsersRepository
  }

  async list(): Promise<{ body: UserEntity[] }> {
    const users = await this.listUsersRepository.list()

    return ({ body: users })
  }
}

export default ListUsersAdapter