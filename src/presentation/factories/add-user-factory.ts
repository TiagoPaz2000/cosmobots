import { ValidationUserAdapter, AddUserAdapter, GenerateUUIDAdapter, ListGroupAdapter, UUIDValidateAdapter } from '@/adapters/usecases/'
import AddUserController from '../controllers/add-user-controller'
import userSchemaValidate from '@/adapters/helpers/user-schema-validate'
import UserRepository from '@/infra/repositories/user-repository'
import GroupRepository from '@/infra/repositories/group-repository'
import ValidateUUID from '@/infra/validators/uuid-validator'

const AddUserFactory = () => {
  const generateUserId = new GenerateUUIDAdapter()
  const userRepository = new UserRepository()
  const addUser = new AddUserAdapter(userRepository)
  const userValidation = new ValidationUserAdapter(userSchemaValidate())
  const groupRepository = new GroupRepository()
  const groupExistsAdapter = new ListGroupAdapter(groupRepository)
  const uuidValidate = new ValidateUUID()
  const uuidValidateAdapter = new UUIDValidateAdapter(uuidValidate)
  const addUserController = new AddUserController(
    userValidation,
    addUser,
    generateUserId,
    groupExistsAdapter,
    uuidValidateAdapter,
  )

  return addUserController
}

export default AddUserFactory