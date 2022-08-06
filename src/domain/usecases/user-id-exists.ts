import User from '../entities/user-entity'

type IResponse = { body: User }

export default interface UserIdExists {
  edit(userId: User['userId']): Promise<IResponse>;
}