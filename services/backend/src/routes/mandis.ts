import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';
import { fetchPrices } from '../services/priceAdapter.js';

export async function mandiRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * GET /mandis/:id/prices — Fetch commodity prices for a mandi
   * Delegates to the AGMARKNET price adapter (cache-first, real API).
   * Never returns hardcoded fake prices.
   */
  fastify.get('/mandis/:id/prices', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Look up the mandi name from the mandis table
    const { data: mandi, error: mandiErr } = await supabase
      .from('mandis')
      .select('id, name')
      .eq('id', id)
      .single();

    if (mandiErr || !mandi) {
      return reply.status(404).send({
        error: 'Not Found',
        message: `Mandi with id '${id}' does not exist`,
      });
    }

    // Fetch prices from AGMARKNET adapter (cache-first)
    const result = await fetchPrices(mandi.name);

    return reply.send({
      mandi_id: mandi.id,
      mandi_name: mandi.name,
      prices: result.prices,
      stale: result.stale,
      fetched_at: result.fetched_at,
      message: result.message,
    });
  });
}
