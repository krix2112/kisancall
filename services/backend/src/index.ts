import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

// supabase.ts validates env vars on import — app crashes here if any are missing
import './supabase.js';

import { authGuard } from './auth.js';
import { farmerRoutes } from './routes/farmers.js';
import { bookingRoutes } from './routes/bookings.js';
import { mandiRoutes } from './routes/mandis.js';
import { staffRoutes } from './routes/staff.js';
import { voiceToolRoutes } from './routes/voiceTools.js';
import { voiceWebhookRoutes } from './routes/voiceWebhook.js';

const fastify = Fastify({ logger: true });

// ============================================================
// Global error handler — consistent JSON error shapes, no stack leaks
// ============================================================
fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error);

  // Fastify validation errors (from JSON schema)
  if (error.validation) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Request validation failed',
      details: error.validation,
    });
  }

  // Known HTTP errors (from reply.status().send())
  const statusCode = error.statusCode ?? 500;
  return reply.status(statusCode).send({
    error: statusCode >= 500 ? 'Internal Server Error' : error.name || 'Error',
    message: statusCode >= 500
      ? 'An unexpected error occurred'
      : error.message,
  });
});

// ============================================================
// Health Check
// ============================================================
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// ============================================================
// Phase 1 routes — real implementations
// ============================================================
fastify.register(farmerRoutes);
fastify.register(bookingRoutes);
fastify.register(mandiRoutes);

// ============================================================
// Phase 2 routes — staff and voice tooling
// ============================================================
fastify.register(staffRoutes);
fastify.register(voiceToolRoutes);
fastify.register(voiceWebhookRoutes);

// ============================================================
// Staff routes — require auth, still 501 (Phase 2 scope)
// ============================================================
fastify.post(
  '/staff/arrivals',
  { preHandler: [authGuard(['operator', 'supervisor', 'admin'])] },
  async (_request, reply) => {
    return reply.status(501).send({
      error: 'Not Implemented',
      message: 'POST /staff/arrivals is scheduled for Phase 2',
    });
  }
);

fastify.post(
  '/staff/procurement',
  { preHandler: [authGuard(['operator', 'supervisor', 'admin'])] },
  async (_request, reply) => {
    return reply.status(501).send({
      error: 'Not Implemented',
      message: 'POST /staff/procurement is scheduled for Phase 2',
    });
  }
);

fastify.patch(
  '/payments/:id',
  { preHandler: [authGuard(['supervisor', 'admin'])] },
  async (_request, reply) => {
    return reply.status(501).send({
      error: 'Not Implemented',
      message: 'PATCH /payments/:id is scheduled for Phase 2',
    });
  }
);

// ============================================================
// Voice & Webhook routes — 501 (Phase 2 / voice-pipeline scope)
// ============================================================
fastify.post('/voice/webhook', async (_request, reply) => {
  return reply.status(501).send({
    error: 'Not Implemented',
    message: 'POST /voice/webhook is scheduled for the voice pipeline phase',
  });
});

fastify.post('/voice/tool/get-slot', async (_request, reply) => {
  return reply.status(501).send({
    error: 'Not Implemented',
    message: 'POST /voice/tool/get-slot is scheduled for the voice pipeline phase',
  });
});

fastify.post('/voice/tool/get-queue', async (_request, reply) => {
  return reply.status(501).send({
    error: 'Not Implemented',
    message: 'POST /voice/tool/get-queue is scheduled for the voice pipeline phase',
  });
});

fastify.post('/voice/tool/get-price', async (_request, reply) => {
  return reply.status(501).send({
    error: 'Not Implemented',
    message: 'POST /voice/tool/get-price is scheduled for the voice pipeline phase',
  });
});

fastify.post('/voice/tool/get-payment', async (_request, reply) => {
  return reply.status(501).send({
    error: 'Not Implemented',
    message: 'POST /voice/tool/get-payment is scheduled for the voice pipeline phase',
  });
});

// ============================================================
// Proof Events — 501 (AgroChain phase)
// ============================================================
fastify.post('/proof-events', async (_request, reply) => {
  return reply.status(501).send({
    error: 'Not Implemented',
    message: 'POST /proof-events is scheduled for the AgroChain phase',
  });
});

fastify.get('/proof/:id', async (_request, reply) => {
  return reply.status(501).send({
    error: 'Not Implemented',
    message: 'GET /proof/:id is scheduled for the AgroChain phase',
  });
});

// ============================================================
// Start server
// ============================================================
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
