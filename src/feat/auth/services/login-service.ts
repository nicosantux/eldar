import { z } from 'zod'

import { type LoginSchema } from '../schemas/login-schema'
import { type User } from '../types/user'

const loginServiceSchema = z.object({
  email: z.string(),
  id: z.string(),
  name: z.string(),
  role: z.union([z.literal('admin'), z.literal('user')]),
})

interface LoginService {
  credentials: LoginSchema
  signal?: AbortSignal
}

export async function loginService({ credentials, signal }: LoginService): Promise<User> {
  const response = await fetch('/api/auth/login', {
    body: JSON.stringify(credentials),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    signal,
  })

  if (!response.ok) {
    const { message } = (await response.json()) as unknown as { message: string }

    throw new Error(message)
  }

  const { data } = (await response.json()) as unknown as { data: unknown }

  const parsedData = loginServiceSchema.safeParse(data)

  if (!parsedData.success) {
    throw new Error('Failed to parse data')
  }

  return parsedData.data
}
