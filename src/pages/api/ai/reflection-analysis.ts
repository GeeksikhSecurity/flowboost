import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { analyzeReflection } from '@/lib/ai';

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
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const result = await analyzeReflection(text);
    
    return res.status(200).json({ 
      analysis: result.analysis,
      success: result.success 
    });
  } catch (error) {
    console.error('Error analyzing reflection:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}