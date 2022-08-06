import { ValidationUserAdapter, AddUserAdapter, GenerateUUIDAdapter } from '@/adapters/usecases/'
import AddUserController from '../controllers/add-user-controller'
import userSchemaValidate from '@/adapters/helpers/user-schema-validate'
import UserRepository from '@/infra/repositories/user-repository'

const AddUserFactory = () => {
  const generateUserId = new GenerateUUIDAdapter()
  const userRepository = new UserRepository()
  const addUser = new AddUserAdapter(userRepository)
  const userValidation = new ValidationUserAdapter(userSchemaValidate())
  const addUserController = new AddUserController(userValidation, addUser, generateUserId)

  return addUserController
}

export default AddUserFactory