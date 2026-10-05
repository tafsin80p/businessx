import { ExpoRequest } from 'expo-router/server';
import connectToDatabase from '../../../lib/db';

// This token must match the "Verify Token" you put in the Meta Developer Portal
const VERIFY_TOKEN = 'businessx_secure_token_2026';

// GET request is used by Meta to verify the Webhook
export async function GET(req: ExpoRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    // Important: Meta expects the exact challenge string as the response body
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } else {
    return new Response('Forbidden', { status: 403 });
  }
}

// POST request is used by Meta to send you new messages
export async function POST(req: ExpoRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();

    // Check if it's an event from a Page subscription (Messenger/Instagram)
    if (body.object === 'page' || body.object === 'instagram') {
      // Loop through all entries and messages
      body.entry.forEach((entry: any) => {
        const webhookEvent = entry.messaging?.[0] || entry.standby?.[0];
        if (webhookEvent && webhookEvent.message) {
          const senderId = webhookEvent.sender.id;
          const messageText = webhookEvent.message.text;
          
          console.log(`Received message from ${senderId}: ${messageText}`);
          // TODO: Save message to MongoDB and notify frontend via websockets
        }
      });
      return new Response('EVENT_RECEIVED', { status: 200 });
    } 
    // Check if it's a WhatsApp business account event
    else if (body.object === 'whatsapp_business_account') {
      body.entry.forEach((entry: any) => {
        const changes = entry.changes?.[0];
        if (changes && changes.value && changes.value.messages) {
          const message = changes.value.messages[0];
          const senderPhone = message.from;
          const messageText = message.text?.body;
          
          console.log(`Received WhatsApp message from ${senderPhone}: ${messageText}`);
          // TODO: Save message to MongoDB
        }
      });
      return new Response('EVENT_RECEIVED', { status: 200 });
    } else {
      return new Response('Not Found', { status: 404 });
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
