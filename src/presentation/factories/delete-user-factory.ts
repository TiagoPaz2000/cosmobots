import { UUIDValidateAdapter, FindUserByIdAdapter } from '@/adapters/usecases/'
import UserRepository from '@/infra/repositories/user-repository'
import DeleteUserController from '../controllers/delete-user-controller'
import ValidateUUID from '@/infra/validators/uuid-validator'
import DeleteUserAdapter from '@/adapters/usecases/delete-user'

const DeleteUserFactory = () => {
  const userRepository = new UserRepository()
  const userExists = new FindUserByIdAdapter(userRepository)
  const uuidValidator = new ValidateUUID()
  const uuidValidate = new UUIDValidateAdapter(uuidValidator)
  const deleteUserAdapter =  new DeleteUserAdapter(userRepository)
  const deleteUserController = new DeleteUserController(userExists, uuidValidate, deleteUserAdapter)

  return deleteUserController
}

export default DeleteUserFactory