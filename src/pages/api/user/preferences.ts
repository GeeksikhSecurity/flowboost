import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserPreferences, saveUserPreferences } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // GET request - retrieve user preferences
  if (req.method === 'GET') {
    try {
      const preferences = await getUserPreferences(session.user.id);
      return res.status(200).json({ preferences });
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // POST request - save user preferences
  if (req.method === 'POST') {
    try {
      const { preferences } = req.body;
      
      if (!preferences) {
        return res.status(400).json({ error: 'Preferences are required' });
      }
      
      const result = await saveUserPreferences(session.user.id, preferences);
      
      if (!result.success) {
        throw new Error('Failed to save preferences');
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}