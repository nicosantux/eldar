import { Box, CircularProgress } from '@mui/material'

export function Spinner() {
  return (
    <Box sx={{ display: 'grid', minHeight: '100dvh', placeItems: 'center' }}>
      <CircularProgress />
    </Box>
  )
}
