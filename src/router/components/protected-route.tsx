import { type ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { useAuth } from '@/feat/auth/hooks/use-auth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' />

  return children
}
