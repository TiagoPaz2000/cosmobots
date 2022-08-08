import User from "@/domain/entities/user-entity"
import { EditUser } from "@/domain/usecases"

export const makeEditUser = (): EditUser => {
  class EditUserStub implements EditUser {
    async edit(userData: User): Promise<{ body: User }> {
      const user = {
        userId: 'valid_userId',
        accountId: 'new_valid_accountId',
        firstName: 'new_valid_firstName',
        lastName: 'new_valid_lastName',
        email: 'new_valid_email',
        groupId: 'new_valid_groupId',
      }

      return ({
        body: user
      })
    }
  }

  return new EditUserStub()
}