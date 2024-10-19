import { type VercelRequest, type VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { method = '' } = req

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST'])

    return res.status(405).json({ message: `Method ${method} Not Allowed` })
  }

  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; SameSite=Strict; Secure')

  return res.status(200).json({ message: 'Logged out' })
}
