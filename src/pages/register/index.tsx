import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import { AuthLayout } from '@/feat/auth/components/auth-layout'
import { useAuth } from '@/feat/auth/hooks/use-auth'
import { registerSchema } from '@/feat/auth/schemas/register-schema'
import { registerService } from '@/feat/auth/services/register-service'
import { useForm } from '@/shared/hooks/use-form'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const { errors, isSubmitting, handleSubmit } = useForm({
    onSubmit: async (credentials, signal) => {
      const user = await registerService({ credentials, signal })

      login(user)
      navigate('/')
    },
    validationSchema: registerSchema,
  })

  return (
    <AuthLayout title='Register'>
      <form
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
      >
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box sx={{ display: 'grid', gap: 0.5 }}>
            <TextField
              aria-errormessage='name-error'
              autoComplete='name'
              error={Boolean(errors.name?.length)}
              label='Full name'
              name='name'
              size='small'
            />
            <Typography color='error' component='p' id='name-error' variant='caption'>
              {errors.name?.join(', ')}
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.5 }}>
            <TextField
              aria-errormessage='email-error'
              autoComplete='email'
              error={Boolean(errors.email?.length)}
              label='Email Address'
              name='email'
              size='small'
            />
            <Typography color='error' component='p' id='email-error' variant='caption'>
              {errors.email?.join(', ')}
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.5 }}>
            <TextField
              autoComplete='current-password'
              error={Boolean(errors.password?.length)}
              id='password'
              label='Password'
              name='password'
              size='small'
              type='password'
            />
            <Typography color='error' component='p' variant='caption'>
              {errors.password?.join(', ')}
            </Typography>
          </Box>
          <Button disabled={isSubmitting} sx={{ gap: 1 }} type='submit' variant='contained'>
            <Typography component='span'>Register</Typography>
            {isSubmitting ? <CircularProgress size={16} /> : null}
          </Button>
        </Box>
      </form>
      {errors.form?.length ? (
        <Alert id='form-error' severity='error' sx={{ marginTop: 2 }}>
          {errors.form.join(', ')}
        </Alert>
      ) : null}
      <Typography align='center' component='p' marginTop={3}>
        Already have an account? <Link to='/login'>Login</Link>
      </Typography>
    </AuthLayout>
  )
}
