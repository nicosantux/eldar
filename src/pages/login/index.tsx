import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import { AuthLayout } from '@/feat/auth/components/auth-layout'
import { useAuth } from '@/feat/auth/hooks/use-auth'
import { loginSchema } from '@/feat/auth/schemas/login-schema'
import { loginService } from '@/feat/auth/services/login-service'
import { useForm } from '@/shared/hooks/use-form'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const { errors, handleSubmit, isSubmitting } = useForm({
    onSubmit: async (credentials, signal) => {
      const user = await loginService({ credentials, signal })

      login(user)
      navigate('/')
    },
    validationSchema: loginSchema,
  })

  return (
    <AuthLayout title='Login'>
      <form
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
      >
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box sx={{ display: 'grid', gap: 0.5 }}>
            <TextField
              aria-errormessage={errors.email?.length ? 'email-error' : 'form-error'}
              autoComplete='email'
              error={Boolean(errors.email?.length) || Boolean(errors.form?.length)}
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
              aria-errormessage={errors.password?.length ? 'password-error' : 'form-error'}
              autoComplete='current-password'
              error={Boolean(errors.password?.length) || Boolean(errors.form?.length)}
              label='Password'
              name='password'
              size='small'
              type='password'
            />
            <Typography color='error' component='p' id='password-error' variant='caption'>
              {errors.password?.join(', ')}
            </Typography>
          </Box>
          <Button disabled={isSubmitting} sx={{ gap: 1 }} type='submit' variant='contained'>
            <Typography component='span'>Login</Typography>
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
        Don&apos;t have an account? <Link to='/register'>Register</Link>
      </Typography>
    </AuthLayout>
  )
}
