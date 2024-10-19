import { useCallback, useState } from 'react'

import { type Post } from '../types/post'

interface UseGetPosts {
  initialPost?: Post[]
}

export function useGetPosts({ initialPost = [] }: UseGetPosts) {
  const [posts, setPosts] = useState<Post[]>(initialPost)

  const addNewPost = useCallback((post: Post) => {
    setPosts((state) => [post, ...state])
  }, [])

  return { addNewPost, posts }
}
