import User from '@/domain/entities/user-entity'

type IRequest = { page: number }

export default interface ListUsersByQueryRepository {
  listByQuery(query: IRequest): Promise<User[]>
}