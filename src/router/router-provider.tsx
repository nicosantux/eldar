import { Suspense } from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { getPosts } from '@/feat/posts/services/get-posts'
import { Spinner } from '@/shared/ui/spinner'

import { NotFound } from './components/not-found'
import { ProtectedRoute } from './components/protected-route'
import { VisitorRoute } from './components/visitor-route'

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFound />,
    lazy: async () => {
      const HomePage = await import('@/pages/home').then((module) => module.default)

      return {
        Component: () => (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
        loader: async ({ request }) => getPosts({ signal: request.signal }),
      }
    },
  },
  {
    path: '/login',
    errorElement: <NotFound />,
    lazy: async () => {
      const LoginPage = await import('@/pages/login').then((module) => module.default)

      return {
        Component: () => (
          <VisitorRoute>
            <LoginPage />
          </VisitorRoute>
        ),
      }
    },
  },
  {
    path: '/register',
    errorElement: <NotFound />,
    lazy: async () => {
      const RegisterPage = await import('@/pages/register').then((module) => module.default)

      return {
        Component: () => (
          <VisitorRoute>
            <RegisterPage />
          </VisitorRoute>
        ),
      }
    },
  },
])

export function AppRouter() {
  return (
    <Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
