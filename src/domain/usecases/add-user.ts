import User from '../entities/user-entity'

type IResponse = { body: User } | undefined

export default interface AddUser {
  add(userData: User): Promise<IResponse>;
}