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
  
  // GET request - retrieve templates
  if (req.method === 'GET') {
    try {
      const { type } = req.query;
      
      let query = `
        SELECT * FROM task_templates
        WHERE 1=1
      `;
      
      const params = [];
      
      if (type) {
        query += ` AND template_type = $1`;
        params.push(type);
      }
      
      query += ` ORDER BY name ASC`;
      
      const result = await sql.query(query, params);
      
      return res.status(200).json({ templates: result.rows });
    } catch (error) {
      console.error('Error getting templates:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}