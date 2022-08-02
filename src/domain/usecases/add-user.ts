import User from '../entities/user-entity'

type IResponse = { body: User }

export default interface AddUser {
  add(userData: User): Promise<IResponse>;
}