import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createCouponHandler,
  deleteCouponHandler,
  getCouponByIdHandler,
  getCouponHandler,
  getCouponsHandler,
  updateCouponHandler,
  getApplicableCouponsHandler,
  applyCouponHandler,
} from '../controllers/coupon.controller';
import {
  createCouponSchema,
  getCouponParamsSchema,
  updateCouponSchema,
  cartSchema,
  applyCouponParamsSchema,
} from '../schemas/coupon.schema';

export default async function couponRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    '/coupons',
    {
      schema: {
        tags: ['Coupons'],
        summary: 'Create a new coupon',
        body: createCouponSchema,
      },
    },
    createCouponHandler,
  );

  server.get(
    '/coupons',
    {
      schema: {
        tags: ['Coupons'],
        summary: 'Get all coupons',
      },
    },
    getCouponsHandler,
  );

  server.get(
    '/coupons/code/:code',
    {
      schema: {
        tags: ['Coupons'],
        summary: 'Get coupon by code',
        params: getCouponParamsSchema,
      },
    },
    getCouponHandler,
  );

  server.get(
    '/coupons/:id',
    {
      schema: {
        tags: ['Coupons'],
        summary: 'Get coupon by ID',
      },
    },
    getCouponByIdHandler,
  );

  server.put(
    '/coupons/:id',
    {
      schema: {
        tags: ['Coupons'],
        summary: 'Update a coupon',
        body: updateCouponSchema,
      },
    },
    updateCouponHandler,
  );

  server.delete(
    '/coupons/:id',
    {
      schema: {
        tags: ['Coupons'],
        summary: 'Delete a coupon',
      },
    },
    deleteCouponHandler,
  );

  server.post(
    '/applicable-coupons',
    {
      schema: {
        tags: ['Cart'],
        summary: 'Get applicable coupons for a cart',
        body: cartSchema,
      },
    },
    getApplicableCouponsHandler,
  );

  server.post(
    '/apply-coupon/:id',
    {
      schema: {
        tags: ['Cart'],
        summary: 'Apply a coupon to a cart',
        body: cartSchema,
        params: applyCouponParamsSchema,
      },
    },
    applyCouponHandler,
  );
}
