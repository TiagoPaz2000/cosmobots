import User from "@/domain/entities/user-entity"
import { ListUsers } from "@/domain/usecases"

export const makeListUsers = (): ListUsers => {
  class ListUsersStub implements ListUsers {
    async list(): Promise<{ body: User[] }> {
      const userData: User[] = [
        {
          userId: 'valid_userId',
          accountId: 'valid_accountId',
          firstName: 'valid_firstName',
          lastName: 'valid_lastName',
          email: 'valid_email',
          groupId: 'valid_groupId',
        }
      ]
      return { body: userData }
    }
  }

  return new ListUsersStub()
}