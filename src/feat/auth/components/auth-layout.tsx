import { type ReactNode } from 'react'

import { Box, Typography } from '@mui/material'

interface AuthLayoutProps {
  children: ReactNode
  title: string
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <Box component='main' sx={{ display: 'grid', minHeight: '100dvh', placeItems: 'center' }}>
      <Box
        aria-labelledby='auth-card'
        component='section'
        sx={(theme) => ({
          border: `1px solid ${theme.palette.grey[100]}`,
          borderRadius: 1.5,
          boxShadow: `2px 4px 8px ${theme.palette.grey[300]}`,
          paddingBlock: 2,
          paddingInline: 3,
          width: 'min(22.5rem, 90%)',
        })}
      >
        <Typography component='h1' id='auth-card' marginBottom={3} textAlign='center' variant='h4'>
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  )
}
