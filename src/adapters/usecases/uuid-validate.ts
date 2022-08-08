import { UUIDValidate } from '@/domain/usecases'
import UUIDValidator from '@/infra/protocols/uuid-validator'

type fields = {
  [key: string]: string
}

class UUIDValidateAdapter implements UUIDValidate {
  constructor(private uuidValidator: UUIDValidator) {
    this.uuidValidator = uuidValidator
  }
  validate(uuid: fields[]): (string | undefined)[] {
    const response = uuid.map((e) => {
      const keys = Object.keys(e)

      if (!this.uuidValidator.validate(e[keys[0]])) {
        return `${keys[0]} must be a uuid`
      }
    })

    return response.filter((e) => e !== undefined)
  }
}

export default UUIDValidateAdapter