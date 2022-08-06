import UUIDValidator from '../protocols/uuid-validator'
import { validate as uuidValidate } from 'uuid'

class ValidateUUID implements UUIDValidator {
  validate(uuid: string): boolean {
    if (uuidValidate(uuid)) {
      return true
    }

    return false
  }
}

export default ValidateUUID