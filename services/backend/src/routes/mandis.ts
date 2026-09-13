import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';
import { fetchPrices } from '../services/priceAdapter.js';

export async function mandiRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * GET /mandis — List all mandis with coordinates stored in the DB table
   * Returns null for latitude/longitude if not geocoded in the database.
   */
  fastify.get('/mandis', async (_request, reply) => {
    // Select all columns from mandis table
    const { data: mandis, error } = await supabase
      .from('mandis')
      .select('*');

    if (error) throw error;

    const result = (mandis || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      district: m.district,
      daily_capacity: m.daily_capacity,
      working_hours: m.working_hours,
      latitude: m.latitude ?? null,
      longitude: m.longitude ?? null,
    }));

    return reply.send(result);
  });

  /**
   * GET /mandis/analytics/market-intelligence
   * Query parameters: mandi, commodity, days
   */
  fastify.get('/mandis/analytics/market-intelligence', async (request, reply) => {
    const query = (request.query as Record<string, string>) || {};
    const mandi = query.mandi || 'Sehore';
    const commodity = query.commodity || 'Wheat';
    const days = parseInt(query.days || '60', 10);

    const { computeMarketIntelligence } = await import('../services/priceAnalytics.js');
    const result = await computeMarketIntelligence(mandi, commodity, days);
    return reply.send(result);
  });

  /**
   * GET /mandis/analytics/ticker
   * Returns live ticker pills for top marquee ribbon
   */
  fastify.get('/mandis/analytics/ticker', async (_request, reply) => {
    const { getMarketTicker } = await import('../services/priceAnalytics.js');
    const ticker = await getMarketTicker();
    return reply.send(ticker);
  });

  /**
   * GET /mandis/:id — Fetch single mandi details with real stored coordinates
   */
  fastify.get('/mandis/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const { data: mandi, error } = await supabase
      .from('mandis')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !mandi) {
      return reply.status(404).send({
        error: 'Not Found',
        message: `Mandi with id '${id}' does not exist`,
      });
    }

    return reply.send({
      id: mandi.id,
      name: mandi.name,
      district: mandi.district,
      daily_capacity: mandi.daily_capacity,
      working_hours: mandi.working_hours,
      latitude: (mandi as any).latitude ?? null,
      longitude: (mandi as any).longitude ?? null,
    });
  });

  /**
   * GET /mandis/:id/prices — Fetch commodity prices for a mandi
   */
  fastify.get('/mandis/:id/prices', async (request, reply) => {
    const { id } = request.params as { id: string };

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

