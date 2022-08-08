import { CheckUserData } from '@/domain/usecases'
import User from '@/domain/entities/user-entity'

export const makeValidation = (): CheckUserData => {
  class ValidationUserStub implements CheckUserData {
    validate(userData: Omit<User, 'userId'>): { message: string } | undefined {
      return
    }
  }

  return new ValidationUserStub()
}