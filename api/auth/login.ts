import { type VercelRequest, type VercelResponse } from '@vercel/node'
import { db } from '@vercel/postgres'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method = '' } = req

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST'])

    return res.status(405).json({ message: `Method ${method} Not Allowed` })
  }

  const client = await db.connect()

  try {
    const userBody = req.body as { email: string; password: string }

    // Check if the user already exists
    const { rows } =
      await client.sql`SELECT id, email, name, password, role FROM users WHERE email = ${userBody.email}`

    // If the user does not exist, return 404
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Compare the password
    const isMatch = await bcrypt.compare(userBody.password, rows[0].password as string)

    if (!isMatch) return res.status(400).json({ message: 'Username or password is not correct' })

    const { email, id, name, role } = rows[0] as {
      email: string
      id: string
      name: string
      role: string
    }

    const token = jwt.sign(
      { user: { email, id, name, role } },
      process.env.JWT_SECRET as unknown as string,
      {
        expiresIn: '1d',
      },
    )

    // Set cookie token
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Strict; Secure`)

    return res.status(200).json({ data: { email, id, name, role } })
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error(error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
