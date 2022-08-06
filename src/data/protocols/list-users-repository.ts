import User from '@/domain/entities/user-entity'

export default interface AddUserRepository {
  list(): Promise<User[]>
}

