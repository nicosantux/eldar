import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { Spinner } from '@/shared/ui/spinner'

import { type User } from '../types/user'

export interface AuthContext {
  login: (user: User) => void
  logout: () => Promise<void>
  user: User | null
}

export const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const logoutController = useRef<AbortController | null>(null)

  const login = useCallback((user: User) => {
    setUser(user)
  }, [])

  const logout = useCallback(async () => {
    logoutController.current = new AbortController()

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        signal: logoutController.current.signal,
      })

      if (!response.ok) throw new Error('Logout failed')

      setUser(null)
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') return
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()

    const checkAuth = async () => {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
        signal: abortController.signal,
      })

      if (response.ok) {
        const { data } = (await response.json()) as unknown as { data: User }

        if (isMounted) {
          setUser(data)
        }
      }
    }

    void checkAuth()
      .catch((error: unknown) => {
        if (error instanceof Error) {
          if (error.name === 'AbortError') return

          // eslint-disable-next-line no-console
          console.error(error)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  const values = useMemo(() => ({ user, login, logout }), [login, logout, user])

  return (
    <AuthContext.Provider value={values}>{isLoading ? <Spinner /> : children}</AuthContext.Provider>
  )
}
