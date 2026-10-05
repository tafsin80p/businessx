import type { VercelRequest, VercelResponse } from '@vercel/node';
import connectToDatabase from '../src/lib/db';
import { Conversation } from '../src/models/Conversation';
import { Message } from '../src/models/Message';

const VERIFY_TOKEN = 'businessx_secure_token_2026';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET logic remains same for verification...
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
      await connectToDatabase();
      const body = req.body;
      console.log('Received Webhook:', JSON.stringify(body, null, 2));

      // Handle Messenger/Instagram
      if (body.object === 'page' || body.object === 'instagram') {
        for (const entry of body.entry) {
          const webhookEvent = entry.messaging?.[0] || entry.standby?.[0];
          if (webhookEvent && webhookEvent.message) {
            const senderId = webhookEvent.sender.id;
            const messageText = webhookEvent.message.text || 'Media Message';
            const platform = body.object === 'page' ? 'messenger' : 'instagram';

            // Find or create conversation
            let conversation = await Conversation.findOne({ platformUserId: senderId });
            if (!conversation) {
              conversation = await Conversation.create({
                platform,
                platformUserId: senderId,
                customerName: `Customer ${senderId.slice(-4)}`, // Placeholder name
                lastMessage: messageText,
                unreadCount: 1,
              });
            } else {
              conversation.lastMessage = messageText;
              conversation.lastMessageTime = new Date();
              conversation.unreadCount += 1;
              await conversation.save();
            }

            // Save message
            await Message.create({
              conversationId: conversation._id,
              senderId: senderId,
              text: messageText,
              isFromBusiness: false,
            });
          }
        }
        return res.status(200).send('EVENT_RECEIVED');
      } 
      // Handle WhatsApp
      else if (body.object === 'whatsapp_business_account') {
        for (const entry of body.entry) {
          const changes = entry.changes?.[0];
          if (changes && changes.value && changes.value.messages) {
            const message = changes.value.messages[0];
            const senderPhone = message.from;
            const messageText = message.text?.body || 'Media Message';

            let conversation = await Conversation.findOne({ platformUserId: senderPhone });
            if (!conversation) {
              conversation = await Conversation.create({
                platform: 'whatsapp',
                platformUserId: senderPhone,
                customerName: `+${senderPhone}`,
                lastMessage: messageText,
                unreadCount: 1,
              });
            } else {
              conversation.lastMessage = messageText;
              conversation.lastMessageTime = new Date();
              conversation.unreadCount += 1;
              await conversation.save();
            }

            await Message.create({
              conversationId: conversation._id,
              senderId: senderPhone,
              text: messageText,
              isFromBusiness: false,
            });
          }
        }
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
