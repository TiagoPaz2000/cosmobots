import User from '@/domain/entities/user-entity'

export default interface DeleteUserRepository {
  destroy(userId: User['userId']): Promise<void>
}

