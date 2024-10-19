import { type ReactNode } from 'react'

import { Avatar, Box, Button, Stack, Typography } from '@mui/material'

import { useAuth } from '@/feat/auth/hooks/use-auth'

export function MainLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth()

  return (
    <Box sx={{ marginInline: 'auto', paddingBlockEnd: 2, width: 'min(100ch, 90%)' }}>
      <Stack alignItems='center' direction='row' justifyContent='space-between' paddingBlock={2}>
        <Stack alignItems='center' direction='row' spacing={1}>
          <Avatar>{user?.name[0]}</Avatar>
          <Typography component='h1' sx={{ display: { xs: 'none', sm: 'block' } }}>
            {user?.name}
          </Typography>
        </Stack>
        <Button onClick={() => void logout()}>Logout</Button>
      </Stack>
      {children}
    </Box>
  )
}
