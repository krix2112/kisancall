import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';
import { authGuard } from '../auth.js';

export async function paymentRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * PATCH /payments/:id
   * Create/update payment record for a procurement
   */
  fastify.patch(
    '/payments/:id',
    { preHandler: [authGuard(['supervisor', 'admin'])] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as {
        status: string;
        reference?: string;
      };

      if (!body.status) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'status is required',
        });
      }

      // Validate procurement exists
      const { data: procurement, error: procErr } = await supabase
        .from('procurements')
        .select('booking_id')
        .eq('booking_id', id)
        .single();

      if (procErr || !procurement) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Procurement not found',
        });
      }

      const dbStatus = body.status.toLowerCase() === 'paid' ? 'completed' : body.status.toLowerCase();

      // Insert/update payments table
      const { data: payment, error: payErr } = await supabase
        .from('payments')
        .upsert({
          procurement_id: id,
          status: dbStatus,
          reference: body.reference || '',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'procurement_id' })
        .select()
        .single();

      if (payErr) throw payErr;

      // Audit log
      const user = (request as any).user;
      await supabase.from('audit_logs').insert({
        actor: user.id,
        action: 'PATCH /payments/:id',
        entity: id
      });

      return reply.send(payment);
    }
  );
}
