import { GenerateUUID } from '@/domain/usecases'
import * as uuid from 'uuid'

class GenerateUUIDAdapter implements GenerateUUID {
  generate(): string {
    const id = uuid.v4()

    return id
  }
}

export default GenerateUUIDAdapter