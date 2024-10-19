import { z } from 'zod'

import { type RegisterSchema } from '../schemas/register-schema'
import { type User } from '../types/user'

const registerServiceSchema = z.object({
  email: z.string(),
  id: z.string(),
  name: z.string(),
  role: z.union([z.literal('admin'), z.literal('user')]),
})

interface RegisterService {
  credentials: RegisterSchema
  signal?: AbortSignal
}

export async function registerService({ credentials, signal }: RegisterService): Promise<User> {
  const response = await fetch('/api/auth/register', {
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

  const parsedData = registerServiceSchema.safeParse(data)

  if (!parsedData.success) {
    throw new Error('Failed to parse data')
  }

  return parsedData.data
}
