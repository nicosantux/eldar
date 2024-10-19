import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <Box sx={{ display: 'grid', minHeight: '100dvh', placeItems: 'center' }}>
      <Box sx={{ display: 'grid', gap: 2, textAlign: 'center' }}>
        <img
          alt=''
          src='https://gifdb.com/images/high/it-crowd-fire-maurice-moss-5j5laa1zosrxyhp9.webp'
        />
        <Typography component='h1' variant='h5'>
          Ooops!
        </Typography>
        <Typography>
          Page not found. <Link to='/'>Go to Home</Link>
        </Typography>
      </Box>
    </Box>
  )
}
