import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

// supabase.ts validates env vars on import — app crashes here if any are missing
import './supabase.js';

import { authGuard } from './auth.js';
import { farmerRoutes } from './routes/farmers.js';
import { bookingRoutes } from './routes/bookings.js';
import { mandiRoutes } from './routes/mandis.js';
import { staffRoutes } from './routes/staff.js';
import { paymentRoutes } from './routes/payments.js';
import { proofRoutes } from './routes/proof.js';
import { voiceRoutes } from './routes/voice.js';

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
// Core Routes
// ============================================================
fastify.register(farmerRoutes);
fastify.register(bookingRoutes);
fastify.register(mandiRoutes);

// Staff & Payment Operations
fastify.register(staffRoutes);
fastify.register(paymentRoutes);

// Voice AI & Telephony Webhook Routes
fastify.register(voiceRoutes);

// AgroChain Proof Anchoring Routes
fastify.register(proofRoutes);

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
