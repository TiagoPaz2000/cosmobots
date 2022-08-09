import ListUsersController from '../controllers/list-users-controller'
import UserRepository from '@/infra/repositories/user-repository'
import { ListUsersAdapter } from '@/adapters/usecases/'

const ListUsersFactory = () => {
  const listUserRepository = new UserRepository()
  const listUserAdapter= new ListUsersAdapter(listUserRepository, listUserRepository)
  const listUsersController = new ListUsersController(listUserAdapter)

  return listUsersController
}

export default ListUsersFactory