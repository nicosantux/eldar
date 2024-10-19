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
    const userBody = req.body as { email: string; name: string; password: string }

    // Check if the user already exists
    const { rows } = await client.sql`SELECT id FROM users WHERE email = ${userBody.email}`

    // If the user does not exist, return 401
    if (rows.length) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userBody.password, 10)

    const result = await client.sql`
      INSERT INTO users (email, name, password, role)
      VALUES (${userBody.email}, ${userBody.name}, ${hashedPassword}, 'user')
      RETURNING email, id, name, role
    `

    const { email, id, name, role } = result.rows[0] as {
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

    return res
      .status(201)
      .json({ data: { email, id, name, role }, message: 'User registered successfuly' })
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error(error)

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
