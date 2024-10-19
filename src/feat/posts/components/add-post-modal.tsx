import { type FormEvent } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  IconButton,
  TextField,
  Box,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material'
import { z } from 'zod'

import { useAuth } from '@/feat/auth/hooks/use-auth'
import { useForm } from '@/shared/hooks/use-form'

import { addPost } from '../services/add-post'
import { type Post } from '../types/post'

interface AddPostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: Post) => void
}

const addPostSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }),
  body: z.string().trim().min(1, { message: 'Body is required' }).trim(),
})

export function AddPostModal({ isOpen, onClose, onSubmit }: AddPostModalProps) {
  const { user } = useAuth()

  const { isSubmitting, errors, handleSubmit } = useForm({
    onSubmit: async (values, signal) => {
      const post = await addPost({ values: { ...values, userId: user?.id ?? '' }, signal })

      onSubmit(post)
      onClose()
    },
    validationSchema: addPostSchema,
  })

  return (
    <Dialog
      PaperProps={{
        component: 'form',
        onSubmit: (event: FormEvent<HTMLFormElement>) => {
          void handleSubmit(event)
        },
        sx: { margin: 0, width: 'min(420px, 90%)' },
      }}
      maxWidth='lg'
      open={isOpen}
    >
      <DialogTitle>Add Post</DialogTitle>
      <IconButton
        aria-label='Close modal'
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          top: theme.spacing(1.5),
          right: theme.spacing(1.5),
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box sx={{ display: 'grid', gap: 0.5 }}>
            <TextField
              aria-errormessage='post-title-error'
              error={Boolean(errors.title?.length)}
              fullWidth
              label='Post Title'
              name='title'
              size='small'
            />
            <Typography color='error' component='p' id='post-title-error' variant='caption'>
              {errors.title?.join(' ')}
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.5 }}>
            <TextField
              aria-errormessage='post-body-error'
              error={Boolean(errors.body?.length)}
              fullWidth
              multiline
              name='body'
              placeholder='Lorem ipsum dolor sit amet consectetur adipisicing elit.'
              rows={8}
            />
            <Typography color='error' component='p' id='post-body-error' variant='caption'>
              {errors.body?.join(' ')}
            </Typography>
          </Box>
        </Box>
        {errors.form?.length ? (
          <Alert severity='error' sx={{ marginTop: 2 }}>
            {errors.form.join(' ')}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions sx={(theme) => ({ padding: `${theme.spacing(2)} ${theme.spacing(3)}` })}>
        <Stack direction='row' spacing={2}>
          <Button onClick={onClose} type='button'>
            Cancel
          </Button>
          <Button sx={{ position: 'relative' }} type='submit' variant='contained'>
            <Typography component='span' sx={{ opacity: !isSubmitting ? 1 : 0 }}>
              Add post
            </Typography>
            {isSubmitting ? (
              <CircularProgress color='inherit' size={20} sx={{ position: 'absolute' }} />
            ) : null}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
