import User from '@/domain/entities/user-entity'

export default interface UserRepository {
  create(userData: User): Promise<User>
}