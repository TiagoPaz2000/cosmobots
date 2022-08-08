import { DeleteUser } from "@/domain/usecases"

export const makeDeleteUser = (): DeleteUser => {
  class DeleteUserStub implements DeleteUser {
    async destroy(userId: string): Promise<void> {}
  }

  return new DeleteUserStub()
}