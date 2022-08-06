import ValidationUser from '@/adapters/usecases/validation-user'
import AddUserController from '../controllers/add-user-controller'
import userSchemaValidate from '@/adapters/helpers/user-schema-validate'
import AddNewUser from '@/adapters/usecases/add-user'
import GenerateUUIDAdapter from '@/adapters/usecases/generate-uuid'
import UserRepository from '@/infra/repositories/add-user-repository'

const AddUserFactory = () => {
  const generateUserId = new GenerateUUIDAdapter()
  const userRepository = new UserRepository()
  const addUser = new AddNewUser(userRepository)
  const userValidation = new ValidationUser(userSchemaValidate())
  const addUserController = new AddUserController(userValidation, addUser, generateUserId)

  return addUserController
}

export default AddUserFactory