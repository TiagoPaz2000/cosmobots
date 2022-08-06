import User from '@/domain/entities/user-entity'

export default interface ListUsersRepository {
  list(): Promise<User[]>
}

