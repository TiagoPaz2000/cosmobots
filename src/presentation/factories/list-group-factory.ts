import { UUIDValidateAdapter, ListGroupAdapter } from '@/adapters/usecases/'
import ValidateUUID from '@/infra/validators/uuid-validator'
import ListGroupController from '../controllers/list-group-controller'
import GroupRepository from '@/infra/repositories/group-repository'

const listGroupFactory = () => {
  const uuidValidate = new ValidateUUID()
  const uuidValidateAdapter = new UUIDValidateAdapter(uuidValidate)
  const groupRepository = new GroupRepository()
  const listGroupAdapter = new ListGroupAdapter(groupRepository)
  const listGroupController = new ListGroupController(listGroupAdapter, uuidValidateAdapter)

  return listGroupController
}

export default listGroupFactory