import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createCouponHandler,
  getCouponsHandler,
  getCouponHandler,
} from '../controllers/coupon.controller';
import {
  createCouponSchema,
  getCouponParamsSchema,
} from '../schemas/coupon.schema';

export default async function couponRoutes(app: FastifyInstance) {
  // Explicitly cast app to include ZodTypeProvider for strict typing in routes
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    '/coupons',
    {
      schema: {
        body: createCouponSchema,
      },
    },
    createCouponHandler,
  );

  server.get('/coupons', getCouponsHandler);

  server.get(
    '/coupons/:code',
    {
      schema: {
        params: getCouponParamsSchema,
      },
    },
    getCouponHandler,
  );
}
