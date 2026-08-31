import Fastify from 'fastify';
import dotenv from 'dotenv';
import { authGuard } from './auth';

dotenv.config();

const fastify = Fastify({ logger: true });

// Health Check Route
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Route scaffoldings (Returning 501 Not Implemented with TODO)

// POST /farmers
fastify.post('/farmers', async (request, reply) => {
  // TODO: Implement farmer creation
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /farmers' });
});

// POST /bookings
fastify.post('/bookings', async (request, reply) => {
  // TODO: Implement slot booking creation
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /bookings' });
});

// GET /farmers/:id/queue
fastify.get('/farmers/:id/queue', async (request, reply) => {
  // TODO: Implement farmer queue status fetch
  return reply.status(501).send({ error: 'Not Implemented', route: 'GET /farmers/:id/queue' });
});

// GET /farmers/:id/status
fastify.get('/farmers/:id/status', async (request, reply) => {
  // TODO: Implement overall farmer status fetch
  return reply.status(501).send({ error: 'Not Implemented', route: 'GET /farmers/:id/status' });
});

// GET /mandis/:id/prices
fastify.get('/mandis/:id/prices', async (request, reply) => {
  // TODO: Implement mandi price list fetch
  return reply.status(501).send({ error: 'Not Implemented', route: 'GET /mandis/:id/prices' });
});

// POST /staff/arrivals
fastify.post('/staff/arrivals', { preHandler: [authGuard(['operator', 'supervisor', 'admin'])] }, async (request, reply) => {
  // TODO: Implement staff arrival check-in logging
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /staff/arrivals' });
});

// POST /staff/procurement
fastify.post('/staff/procurement', { preHandler: [authGuard(['operator', 'supervisor', 'admin'])] }, async (request, reply) => {
  // TODO: Implement procurement details entry
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /staff/procurement' });
});

// PATCH /payments/:id
fastify.patch('/payments/:id', { preHandler: [authGuard(['supervisor', 'admin'])] }, async (request, reply) => {
  // TODO: Implement payment status update
  return reply.status(501).send({ error: 'Not Implemented', route: 'PATCH /payments/:id' });
});

// Voice Tool & Webhook routes
fastify.post('/voice/webhook', async (request, reply) => {
  // TODO: Implement telephony incoming voice webhook handler
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /voice/webhook' });
});

fastify.post('/voice/tool/get-slot', async (request, reply) => {
  // TODO: Implement voice assistant tool: get available slots
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /voice/tool/get-slot' });
});

fastify.post('/voice/tool/get-queue', async (request, reply) => {
  // TODO: Implement voice assistant tool: get current queue status
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /voice/tool/get-queue' });
});

fastify.post('/voice/tool/get-price', async (request, reply) => {
  // TODO: Implement voice assistant tool: get mandi commodity price
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /voice/tool/get-price' });
});

fastify.post('/voice/tool/get-payment', async (request, reply) => {
  // TODO: Implement voice assistant tool: get payment status
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /voice/tool/get-payment' });
});

// Proof Events
fastify.post('/proof-events', async (request, reply) => {
  // TODO: Implement proof event creation and blockchain anchor submit
  return reply.status(501).send({ error: 'Not Implemented', route: 'POST /proof-events' });
});

fastify.get('/proof/:id', async (request, reply) => {
  // TODO: Implement proof record retrieval by ID
  return reply.status(501).send({ error: 'Not Implemented', route: 'GET /proof/:id' });
});

const start = async () => {
  const port = Number(process.env.PORT) || 4000;
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Backend server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
