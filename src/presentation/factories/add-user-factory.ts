import { ValidationUserAdapter, AddUserAdapter, GenerateUUIDAdapter, ListGroupAdapter } from '@/adapters/usecases/'
import AddUserController from '../controllers/add-user-controller'
import userSchemaValidate from '@/adapters/helpers/user-schema-validate'
import UserRepository from '@/infra/repositories/user-repository'
import GroupRepository from '@/infra/repositories/group-repository'

const AddUserFactory = () => {
  const generateUserId = new GenerateUUIDAdapter()
  const userRepository = new UserRepository()
  const addUser = new AddUserAdapter(userRepository)
  const userValidation = new ValidationUserAdapter(userSchemaValidate())
  const groupRepository = new GroupRepository()
  const groupExistsAdapter = new ListGroupAdapter(groupRepository)
  const addUserController = new AddUserController(userValidation, addUser, generateUserId, groupExistsAdapter)

  return addUserController
}

export default AddUserFactory