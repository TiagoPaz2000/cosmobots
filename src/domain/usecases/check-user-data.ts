import User from '../entities/user-entity'

type IResponse = { message: string } | undefined

export default interface CheckUserData {
  validate(userData: Omit<User, 'id'>): IResponse;
}