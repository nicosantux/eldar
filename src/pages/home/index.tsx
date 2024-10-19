import { useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import { Alert, Box, Button, Snackbar, Tooltip, Typography } from '@mui/material'
import { useLoaderData } from 'react-router-dom'

import { useAuth } from '@/feat/auth/hooks/use-auth'
import { AddPostModal } from '@/feat/posts/components/add-post-modal'
import { useGetPosts } from '@/feat/posts/hook/use-get-posts'
import { type Post } from '@/feat/posts/types/post'
import { MainLayout } from '@/shared/components/main-layout'

export default function HomePage() {
  const initialPost = useLoaderData() as Post[]

  const { user } = useAuth()
  const { addNewPost, posts } = useGetPosts({ initialPost })
  const [isOpen, setIsOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleAddPost = (post: Post) => {
    addNewPost(post)
    setShowToast(true)
  }

  return (
    <MainLayout>
      <Box
        aria-labelledby='post-section'
        component='section'
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gridTemplateRows: 'repeat(2, auto)',
        }}
      >
        <Typography className='sr-only' component='h1' id='post-section'>
          Posts
        </Typography>
        {posts.map((post, index) => (
          <Box
            aria-labelledby={post.id.toString()}
            component='article'
            key={post.id}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.grey[100]}`,
              borderRadius: 1.5,
              boxShadow: `2px 4px 8px ${theme.palette.grey[300]}`,
              display: 'grid',
              gap: 0.5,
              gridColumn: index === 0 ? '1/-1' : 'unset',
              gridRow: 'span 2',
              gridTemplateRows: 'subgrid',
              maxHeight: 'min(300px, 100%)',
              paddingBlock: 2,
              paddingInline: 3,
            })}
          >
            <Typography
              component='h2'
              id={post.id.toString()}
              sx={{ alignSelf: 'end', textWrap: 'balance' }}
              variant='h6'
            >
              {post.title}
            </Typography>
            <Typography sx={{ display: '-webkit-box', textWrap: 'pretty' }}>{post.body}</Typography>
          </Box>
        ))}
      </Box>
      {isOpen ? (
        <AddPostModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleAddPost} />
      ) : null}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        open={showToast}
      >
        <Alert severity='success'>Post added successfully</Alert>
      </Snackbar>
      {user?.role === 'admin' && (
        <Tooltip arrow placement='left' title='Add new post'>
          <Button
            aria-label='Add new post'
            color='primary'
            onClick={() => setIsOpen(true)}
            size='medium'
            sx={(theme) => ({
              aspectRatio: 1,
              borderRadius: '100vmax',
              bottom: theme.spacing(2),
              position: 'fixed',
              right: theme.spacing(4),
            })}
            variant='contained'
          >
            <AddIcon fontSize='medium' />
          </Button>
        </Tooltip>
      )}
    </MainLayout>
  )
}
