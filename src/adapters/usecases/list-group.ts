import ListGroupRepository from '@/data/protocols/list-group-repository'
import GroupEntity from '@/domain/entities/group-entity'
import ListGroup from '@/domain/usecases/list-group'

class ListGroupAdapter implements ListGroup {
  constructor(private listGroupRepository: ListGroupRepository) {
    this.listGroupRepository = listGroupRepository
  }

  async find(groupId: GroupEntity['groupId']): Promise<{ body: GroupEntity | undefined }> {
    const response = await this.listGroupRepository.find(groupId)

    return ({ body: response })
  }
}

export default ListGroupAdapter