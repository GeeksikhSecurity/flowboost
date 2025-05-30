import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { trackEvent } from '@/lib/db';

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
    const { eventType, eventData = {} } = req.body;
    
    if (!eventType) {
      return res.status(400).json({ error: 'Event type is required' });
    }
    
    const result = await trackEvent(session.user.id, eventType, eventData);
    
    if (!result.success) {
      throw new Error('Failed to track event');
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}