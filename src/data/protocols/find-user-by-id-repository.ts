import User from '@/domain/entities/user-entity'

export default interface FindUserByIdRepository {
  find(userId: User['userId']): Promise<User>
}

