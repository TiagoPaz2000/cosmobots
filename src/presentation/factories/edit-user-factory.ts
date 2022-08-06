import { EditUserAdapter, UUIDValidateAdapter, FindUserByIdAdapter, ValidationUserAdapter } from '@/adapters/usecases/'
import EditUserController from '../controllers/edit-user-controller'
import userSchemaValidate from '@/adapters/helpers/user-schema-validate'
import UserRepository from '@/infra/repositories/user-repository'
import ValidateUUID from '@/infra/validators/uuid-validator'

const EditUserFactory = () => {
  const userValidation = new ValidationUserAdapter(userSchemaValidate())
  const userRepository = new UserRepository()
  const userExist = new FindUserByIdAdapter(userRepository)
  const uuidValidate = new ValidateUUID()
  const uuidValidateAdapter = new UUIDValidateAdapter(uuidValidate)
  const editUser = new EditUserAdapter(userRepository)
  const addUserController = new EditUserController(editUser, uuidValidateAdapter, userExist, userValidation)

  return addUserController
}

export default EditUserFactory