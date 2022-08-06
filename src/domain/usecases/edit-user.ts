import User from '../entities/user-entity'

type IResponse = { body: User }

export default interface EditUser {
  edit(userData: User): Promise<IResponse>;
}