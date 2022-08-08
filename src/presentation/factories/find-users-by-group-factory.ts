import { ListGroupAdapter, UUIDValidateAdapter } from '@/adapters/usecases'
import FindUsersByGroupdAdapter from '@/adapters/usecases/find-user-by-group'
import GroupRepository from '@/infra/repositories/group-repository'
import UserRepository from '@/infra/repositories/user-repository'
import ValidateUUID from '@/infra/validators/uuid-validator'
import ListUsersByGroupController from '../controllers/list-users-by-groups-controller'

const FindUsersByGroupFactory = () => {
  const userRepository = new UserRepository()
  const findUsersByGroup = new FindUsersByGroupdAdapter(userRepository)
  const groupRepository = new GroupRepository()
  const groupExistsAdapter = new ListGroupAdapter(groupRepository)
  const uuidValidate = new ValidateUUID()
  const uuidValidateAdapter = new UUIDValidateAdapter(uuidValidate)
  const listUsersByGroupController = new ListUsersByGroupController(groupExistsAdapter, findUsersByGroup, uuidValidateAdapter)

  return listUsersByGroupController
}

export default FindUsersByGroupFactory