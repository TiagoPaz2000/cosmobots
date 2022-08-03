import userEntity from '../../domain/entities/user-entity'
import { CheckUserData } from '../../domain/usecases'
import { ZodObject } from 'zod'

class ValidationUser implements CheckUserData {
  constructor(private userSchemaValidate: ZodObject<never>) {
    this.userSchemaValidate = userSchemaValidate
  }

  validate(userData: Omit<userEntity, 'userId'>): { message: string } | undefined {
    const valid = this.userSchemaValidate.safeParse(userData)
    if (valid.success) {
      return undefined
    }

    return { message: JSON.parse(valid.error.message)[0].message }
  }
}

export default ValidationUser