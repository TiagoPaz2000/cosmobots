import { UUIDValidate } from "@/domain/usecases"

export const makeUUIDValidate = (): UUIDValidate => {
  class UUIDValidateStub implements UUIDValidate {
    validate(uuid: { [key: string]: string }[]): (string | undefined)[] {
      return []
    }
  }

  return new UUIDValidateStub()
}