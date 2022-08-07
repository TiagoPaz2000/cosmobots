import User from '../entities/user-entity'

type IResponse = { body: User[] }

export default interface ListUsers {
  list(): Promise<IResponse>;
}