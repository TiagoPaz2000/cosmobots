import Group from '../entities/group-entity'

type IResponse = { body: Group | undefined }

export default interface ListGroup {
  find(groupId: Group['groupId']): Promise<IResponse>;
}