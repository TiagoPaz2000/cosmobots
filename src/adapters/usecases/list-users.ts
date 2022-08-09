import { ListUsersRepository, ListUsersByQueryRepository } from '@/data/protocols'
import UserEntity from '@/domain/entities/user-entity'
import { ListUsers } from '@/domain/usecases'

class ListUsersAdapter implements ListUsers {
  constructor(private listUsersRepository: ListUsersRepository, private listUsersByQueryRepository: ListUsersByQueryRepository) {
    this.listUsersRepository = listUsersRepository
    this.listUsersByQueryRepository = listUsersByQueryRepository
  }

  async list(query: { page: number }): Promise<{ body: UserEntity[] }> {
    if (query.page) {
      const users = await this.listUsersByQueryRepository.listByQuery(query)

      return ({ body: users })
    }
    const users = await this.listUsersRepository.list()

    return ({ body: users })
  }
}

export default ListUsersAdapter