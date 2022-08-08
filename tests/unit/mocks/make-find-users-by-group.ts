import User from "@/domain/entities/user-entity"
import { FindUsersByGroup } from "@/domain/usecases"

export const userData: User[] = [
  {
    userId: 'valid_userId',
    accountId: 'valid_accountId',
    firstName: 'valid_firstName',
    lastName: 'valid_lastName',
    email: 'valid_email',
    groupId: 'valid_groupId',
  }
]

export const makeFindUsersByGroup = (): FindUsersByGroup => {
  class FindUsersByGroupStub implements FindUsersByGroup {
    async find(groupId: string): Promise<{ body: User[] }> {
      return { body: userData }
    }
  }

  return new FindUsersByGroupStub()
}