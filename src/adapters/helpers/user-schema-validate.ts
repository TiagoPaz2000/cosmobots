import { z } from 'zod'

const userSchemaValidate = () => {
  const zodSchema = z.object({
    accountId: z.string({ required_error: '"accountId" is required'}),
    // firstName: z.string().min(2),
    // lastName: z.string().min(2),
    // email: z.string().email(),
    // groupId: z.string(),
  })

  return zodSchema
}

export default userSchemaValidate