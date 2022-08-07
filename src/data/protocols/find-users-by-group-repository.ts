import Group from '@/domain/entities/group-entity'
import User from '@/domain/entities/user-entity'

export default interface FindUsersByGroupRepository {
  find(groupId: Group['groupId']): Promise<User[]>
}

