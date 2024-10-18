import { type VercelRequest, type VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).send('Hello World!')
}
