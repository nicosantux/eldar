import { z } from 'zod'

import { loginSchema } from './login-schema'

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(3, { message: 'Name must be at least 3 characters long' }),
})

export type RegisterSchema = z.infer<typeof registerSchema>
