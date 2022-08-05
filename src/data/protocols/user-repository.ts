import User from '@/domain/entities/user-entity'

export default interface AddUserRepository {
  create(userData: User): Promise<User>
}