import { z } from 'zod'

import { POST_API_BASE_URL } from '../constants/posts-api-url'
import { type Post } from '../types/post'

const postServiceSchema = z.array(
  z.object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
  }),
)

interface GetPostsService {
  signal?: AbortSignal
}

export async function getPosts({ signal }: GetPostsService): Promise<Post[]> {
  const response = await fetch(`${POST_API_BASE_URL}/posts`, {
    headers: { 'Content-Type': 'application/json' },
    signal,
  })

  if (!response.ok) throw new Error('Failed to fetch posts')

  const data = (await response.json()) as unknown

  const posts = postServiceSchema.safeParse(data)

  if (!posts.success) throw new Error('Failed to parse posts')

  return posts.data.map((post) => ({ ...post, userId: post.userId.toString() }))
}
