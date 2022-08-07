import { ListGroupAdapter } from '@/adapters/usecases'
import FindUsersByGroupdAdapter from '@/adapters/usecases/find-user-by-group'
import GroupRepository from '@/infra/repositories/group-repository'
import UserRepository from '@/infra/repositories/user-repository'
import ListUsersByGroupController from '../controllers/list-users-by-groups-controller'

const FindUsersByGroupFactory = () => {
  const userRepository = new UserRepository()
  const findUsersByGroup = new FindUsersByGroupdAdapter(userRepository)
  const groupRepository = new GroupRepository()
  const groupExistsAdapter = new ListGroupAdapter(groupRepository)
  const listUsersByGroupController = new ListUsersByGroupController(groupExistsAdapter, findUsersByGroup)

  return listUsersByGroupController
}

export default FindUsersByGroupFactory