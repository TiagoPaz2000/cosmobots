import { FindUserByIdRepository } from '@/data/protocols'
import UserEntity from '@/domain/entities/user-entity'
import { FindUserById } from '@/domain/usecases'

class FindUserByIdAdapter implements FindUserById {
  constructor(private findUserByIdRepository: FindUserByIdRepository) {
    this.findUserByIdRepository = findUserByIdRepository
  }
  async find(userId: string): Promise<{ body: UserEntity; }> {
    const response = await this.findUserByIdRepository.find(userId)

    return ({ body: response })
  }
}

export default FindUserByIdAdapter