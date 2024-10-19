import { type VercelRequest, type VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { method = '', cookies } = req

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])

    return res.status(405).json({ message: `Method ${method} Not Allowed` })
  }

  if (!cookies.token) {
    return res.status(200).json({ data: null })
  }

  try {
    const { user } = jwt.verify(
      cookies.token,
      process.env.JWT_SECRET as unknown as string,
    ) as unknown as { user: unknown }

    return res.status(200).json({ data: user })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized' })
      }
    }
  }
}
