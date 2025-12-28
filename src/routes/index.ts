import { FastifyInstance } from 'fastify';

import couponRoutes from './coupon.routes';

async function routes(fastify: FastifyInstance) {
  fastify.register(couponRoutes);

  fastify.get('/', async () => {
    return { message: 'Coupon Backend is running!' };
  });
}

export default routes;
