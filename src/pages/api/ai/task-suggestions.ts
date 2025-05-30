import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { generateTaskSuggestions } from '@/lib/ai';
import { getUserPreferences } from '@/lib/db';

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
    const { taskTitle } = req.body;
    
    if (!taskTitle) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    // Get user preferences to personalize suggestions
    const userPreferences = await getUserPreferences(session.user.id);
    
    const result = await generateTaskSuggestions(taskTitle, userPreferences);
    
    return res.status(200).json({ 
      suggestions: result.suggestions,
      success: result.success 
    });
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}