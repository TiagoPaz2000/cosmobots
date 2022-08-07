import { ListGroupRepository } from '@/data/protocols'
import GroupEntity from '@/domain/entities/group-entity'
import dbConnection from '../database/connection'
import serializeGroup from '../helpers/serialize-group-data'

class GroupRepository implements ListGroupRepository {
  async find(groupId: string): Promise<GroupEntity | undefined> {
    const query = 'SELECT * FROM groups WHERE group_id = $1'
    const { rows } = await dbConnection.query(query, [groupId])
    if (rows[0]) {
      return serializeGroup.serializeResponse(rows[0])
    }
  }

  async create(groupData: Omit<GroupEntity, 'groupId'>): Promise<GroupEntity> {
    const group = serializeGroup.serializeInsert(groupData)
    const query = 'INSERT INTO groups(group_name, group_description) VALUES($1, $2) RETURNING *'
    const { rows } = await dbConnection.query(query, group)
    return serializeGroup.serializeResponse(rows[0])
  }
}

export default GroupRepository