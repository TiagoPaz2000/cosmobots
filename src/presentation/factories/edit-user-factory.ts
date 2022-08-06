import EditUserController from '../controllers/edit-user-controller'
import EditUserAdapter from '@/adapters/usecases/edit-user'
import UUIDValidateAdapter from '@/adapters/usecases/uuid-validate'
import FindUserByIdAdapter from '@/adapters/usecases/find-user'
import ValidationUser from '@/adapters/usecases/validation-user'
import userSchemaValidate from '@/adapters/helpers/user-schema-validate'
import UserRepository from '@/infra/repositories/user-repository'
import ValidateUUID from '@/infra/validators/uuid-validator'

const EditUserFactory = () => {
  const userValidation = new ValidationUser(userSchemaValidate())
  const userRepository = new UserRepository()
  const userExist = new FindUserByIdAdapter(userRepository)
  const uuidValidate = new ValidateUUID()
  const uuidValidateAdapter = new UUIDValidateAdapter(uuidValidate)
  const editUser = new EditUserAdapter(userRepository)
  const addUserController = new EditUserController(editUser, uuidValidateAdapter, userExist, userValidation)

  return addUserController
}

export default EditUserFactory