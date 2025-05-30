import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { feedback } = req.body;
    
    if (!feedback) {
      return res.status(400).json({ error: 'Feedback is required' });
    }
    
    // Store feedback in database
    await sql`
      INSERT INTO user_feedback (user_id, feedback)
      VALUES (${session.user.id}, ${feedback})
    `;
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}