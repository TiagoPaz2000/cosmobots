import { EditUserAdapter, UUIDValidateAdapter, FindUserByIdAdapter, ValidationUserAdapter, ListGroupAdapter } from '@/adapters/usecases/'
import EditUserController from '../controllers/edit-user-controller'
import userSchemaValidate from '@/adapters/helpers/user-schema-validate'
import UserRepository from '@/infra/repositories/user-repository'
import ValidateUUID from '@/infra/validators/uuid-validator'
import GroupRepository from '@/infra/repositories/group-repository'

const EditUserFactory = () => {
  const userValidation = new ValidationUserAdapter(userSchemaValidate())
  const userRepository = new UserRepository()
  const userExist = new FindUserByIdAdapter(userRepository)
  const uuidValidate = new ValidateUUID()
  const uuidValidateAdapter = new UUIDValidateAdapter(uuidValidate)
  const editUser = new EditUserAdapter(userRepository)
  const groupRepository = new GroupRepository()
  const groupExistsAdapter = new ListGroupAdapter(groupRepository)
  const addUserController = new EditUserController(
    editUser,
    uuidValidateAdapter,
    userExist,
    userValidation,
    groupExistsAdapter,
  )

  return addUserController
}

export default EditUserFactory