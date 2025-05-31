import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // POST request - track template usage
  if (req.method === 'POST') {
    try {
      const { templateId, taskId, stepsUsed } = req.body;
      
      if (!templateId || !taskId || stepsUsed === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      await sql.query(
        `INSERT INTO template_usage (user_id, template_id, task_id, steps_used)
         VALUES ($1, $2, $3, $4)`,
        [session.user.id, templateId, taskId, stepsUsed]
      );
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error tracking template usage:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}