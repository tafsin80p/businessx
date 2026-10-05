import type { VercelRequest, VercelResponse } from '@vercel/node';

const VERIFY_TOKEN = 'businessx_secure_token_2026';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Forbidden');
    }
  } 
  
  if (req.method === 'POST') {
    try {
      const body = req.body;
      console.log('Received Webhook:', JSON.stringify(body, null, 2));

      // Check if it's an event from a Page subscription (Messenger/Instagram)
      if (body.object === 'page' || body.object === 'instagram') {
        return res.status(200).send('EVENT_RECEIVED');
      } 
      // Check if it's a WhatsApp business account event
      else if (body.object === 'whatsapp_business_account') {
        return res.status(200).send('EVENT_RECEIVED');
      } else {
        return res.status(404).send('Not Found');
      }
    } catch (error) {
      console.error('Webhook Error:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
