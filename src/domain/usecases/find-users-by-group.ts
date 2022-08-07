import User from '../entities/user-entity'
import Group from '../entities/group-entity'

type IResponse = { body: User[] }

export default interface FindUsersByGroup {
  find(groupId: Group['groupId']): Promise<IResponse>;
}