import User from '@/domain/entities/user-entity'

export default interface ListUserRepository {
  list(): Promise<User[]>
}

