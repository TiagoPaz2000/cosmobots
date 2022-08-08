import Group from "@/domain/entities/group-entity"
import ListGroup from "@/domain/usecases/list-group"

export const makeGroupExists = (): ListGroup => {
  class GroupExistsStub implements ListGroup {
    async find(groupId: string): Promise<{ body: Group | undefined }> {
      return ({
        body: {
          groupId: 'valid_groupId',
          groupName: 'valid_groupName',
          groupDescription: undefined
      }})
    }
  }

  return new GroupExistsStub
}