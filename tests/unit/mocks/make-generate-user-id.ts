import { GenerateUUID } from "@/domain/usecases"

export const makeGenerateUserId = (): GenerateUUID => {
  class GenerateUserIdStub implements GenerateUUID {
    generate(): string {
      return 'valid_userId'
    }
  }

  return new GenerateUserIdStub()
}