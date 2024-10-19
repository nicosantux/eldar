import { z } from 'zod'

import { POST_API_BASE_URL } from '../constants/posts-api-url'
import { type Post } from '../types/post'

const addPostSchema = z.object({
  body: z.string(),
  id: z.number(),
  title: z.string(),
  userId: z.string(),
})

interface AddPostService {
  signal?: AbortSignal
  values: Pick<Post, 'body' | 'title' | 'userId'>
}

export async function addPost({ signal, values }: AddPostService): Promise<Post> {
  const result = await fetch(`${POST_API_BASE_URL}/posts`, {
    body: JSON.stringify(values),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    method: 'POST',
    signal,
  })

  if (!result.ok) {
    throw new Error('Failed to add post')
  }

  const data = (await result.json()) as unknown
  const parsedData = addPostSchema.safeParse(data)

  if (!parsedData.success) throw new Error('Failed to parse data')

  return parsedData.data
}
