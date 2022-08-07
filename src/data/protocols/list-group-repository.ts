import Group from '@/domain/entities/group-entity'

export default interface ListGroupRepository {
  find(groupId: Group['groupId']): Promise<Group>
}

