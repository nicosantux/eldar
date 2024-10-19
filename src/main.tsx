import React from 'react'
import ReactDOM from 'react-dom/client'

import CssBaseline from '@mui/material/CssBaseline'

import { AuthProvider } from '@/feat/auth/context/auth-context.tsx'
import { AppRouter } from '@/router/router-provider.tsx'

import './index.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CssBaseline />
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>,
)
