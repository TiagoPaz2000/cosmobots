import User from '../entities/user-entity'

type IResponse = { body: User[] }

type IRequest = { page?: number }

export default interface ListUsers {
  list(query: IRequest): Promise<IResponse>;
}