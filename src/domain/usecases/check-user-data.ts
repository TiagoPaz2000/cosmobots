import User from '../entities/user-entity';

export default interface CheckUserData {
  validate(userData: User): void;
}