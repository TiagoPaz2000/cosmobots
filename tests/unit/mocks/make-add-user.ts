import User from "@/domain/entities/user-entity"
import { AddUser } from "@/domain/usecases"

export const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    async add(userData: User): Promise<{ body: User }> {
      return { body: userData }
    }
  }

  return new AddUserStub()
}