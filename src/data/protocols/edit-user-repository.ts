import User from '@/domain/entities/user-entity'

export default interface EditUserRepository {
  edit(userData: User): Promise<User>
}

