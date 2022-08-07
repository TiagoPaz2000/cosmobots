import Group from '../entities/group-entity'

type IResponse = { body: Group }

export default interface ListGroup {
  find(groupId: Group['groupId']): Promise<IResponse>;
}