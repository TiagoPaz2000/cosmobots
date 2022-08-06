import User from '../entities/user-entity'

type IResponse = { body: User }

export default interface findUserById {
  find(userId: User['userId']): Promise<IResponse>;
}