import { FindUsersByGroupRepository } from '@/data/protocols'
import UserEntity from '@/domain/entities/user-entity'
import { FindUsersByGroup } from '@/domain/usecases'

class FindUsersByGroupdAdapter implements FindUsersByGroup {
  constructor(private findUsersByGroupRepository: FindUsersByGroupRepository) {
    this.findUsersByGroupRepository = findUsersByGroupRepository
  }
  async find(groupId: string): Promise<{ body: UserEntity[] }> {
    const response = await this.findUsersByGroupRepository.find(groupId)

    return ({ body: response })
  }
}

export default FindUsersByGroupdAdapter