import type { VercelRequest, VercelResponse } from '@vercel/node';
import connectToDatabase from '../src/lib/db';
import { Conversation } from '../src/models/Conversation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration to allow mobile app to fetch
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();
    
    if (req.method === 'GET') {
      const conversations = await Conversation.find({}).sort({ lastMessageTime: -1 }).limit(50);
      return res.status(200).json(conversations);
    }
    
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
