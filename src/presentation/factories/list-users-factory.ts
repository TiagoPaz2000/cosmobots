import ListUsersController from '../controllers/list-users-controller'
import UserRepository from '@/infra/repositories/user-repository'
import ListAllUsers from '@/adapters/usecases/list-users'

const ListUsersFactory = () => {
  const listUserRepository = new UserRepository()
  const listUserAdapter= new ListAllUsers(listUserRepository)
  const listUsersController = new ListUsersController(listUserAdapter)

  return listUsersController
}

export default ListUsersFactory