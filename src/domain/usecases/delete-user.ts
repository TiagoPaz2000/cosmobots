import User from '../entities/user-entity'

export default interface DeleteUser {
  destroy(userId: User['userId']): Promise<void>;
}