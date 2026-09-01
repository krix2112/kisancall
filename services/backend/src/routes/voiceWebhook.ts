import { FastifyInstance } from 'fastify';

/**
 * Voice webhook stub — inbound telephony handler.
 *
 * Do not build this alone — the exact payload shape (what your telephony
 * provider sends on an inbound call, what you need to return to route
 * audio/start the AI conversation) has to be agreed with whoever owns
 * the voice pipeline first.
 *
 * Stubbed honestly with 501 and documentation until joint session occurs.
 */
export async function voiceWebhookRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/voice/webhook', async (_request, reply) => {
    return reply.status(501).send({
      error: 'Not Implemented',
      message: 'POST /voice/webhook payload shape pending joint session with voice-pipeline owner',
      documentation: 'Do not implement this endpoint alone — coordinate with voice-pipeline team on:',
      details: [
        'Inbound call payload format from telephony provider',
        'Expected response format to route audio/start AI conversation',
        'Authentication requirements (if any)',
        'Session initialization protocol',
      ],
    });
  });
}