import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createCouponHandler,
  deleteCouponHandler,
  getCouponByIdHandler,
  getCouponHandler,
  getCouponsHandler,
  updateCouponHandler,
} from '../controllers/coupon.controller';
import {
  createCouponSchema,
  getCouponParamsSchema,
  updateCouponSchema,
} from '../schemas/coupon.schema';

export default async function couponRoutes(app: FastifyInstance) {
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
    '/coupons/code/:code',
    {
      schema: {
        params: getCouponParamsSchema,
      },
    },
    getCouponHandler,
  );

  server.get('/coupons/:id', getCouponByIdHandler);

  server.put(
    '/coupons/:id',
    {
      schema: {
        body: updateCouponSchema,
      },
    },
    updateCouponHandler,
  );

  server.delete('/coupons/:id', deleteCouponHandler);
}
