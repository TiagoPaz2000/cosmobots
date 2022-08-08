import Group from "@/domain/entities/group-entity"
import ListGroup from "@/domain/usecases/list-group"

export const groupData: Group = {
  groupId: 'valid_groupId',
  groupName: 'valid_groupName',
  groupDescription: undefined
}

export const makeListGroup = (): ListGroup => {
  class ListGroupStub implements ListGroup {
    async find(groupId: string): Promise<{ body: Group }> {
      return ({ body: groupData })
    }
  }

  return new ListGroupStub()
}