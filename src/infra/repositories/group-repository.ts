import { ListGroupRepository } from '@/data/protocols'
import GroupEntity from '@/domain/entities/group-entity'
import dbConnection from '../database/connection'
import serializeGroup from '../helpers/serialize-group-data'

class GroupRepository implements ListGroupRepository {
  async find(groupId: string): Promise<GroupEntity> {
    const query = 'SELECT * FROM groups WHERE group_id = $1'
    const { rows } = await dbConnection.query(query, [groupId])
    const user = serializeGroup.serializeResponse(rows[0])
    return user
  }
}

export default GroupRepository