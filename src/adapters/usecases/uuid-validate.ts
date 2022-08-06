import { UUIDValidate } from '@/domain/usecases'
import UUIDValidator from '@/infra/protocols/uuid-validator'

class UUIDValidateAdapter implements UUIDValidate {
  constructor(private uuidValidator: UUIDValidator) {
    this.uuidValidator = uuidValidator
  }
  validate(uuid: string): { valid: boolean } {
    const validUUID = this.uuidValidator.validate(uuid)

    return ({ valid: validUUID })
  }
}

export default UUIDValidateAdapter