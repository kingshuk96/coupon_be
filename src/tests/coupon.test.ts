import supertest from 'supertest';
import App from '../app';
import { FastifyInstance } from 'fastify';
import prisma from '../config/db';

describe('Coupon APIs', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await App();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  describe('POST /coupons', () => {
    it('should create a new cart-wise coupon', async () => {
      const code = `TEST_CART_${Date.now()}`;
      const payload = {
        code,
        discount: 10,
        discountType: 'PERCENTAGE',
        expiryDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        type: 'cart-wise',
        usageLimit: 100,
        details: {
          threshold: 100,
        },
      };

      const response = await supertest(app.server)
        .post('/api/v1/coupons')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        code: payload.code,
        type: payload.type,
      });

      // Cleanup
      await prisma.coupon.delete({ where: { code } });
    });

    it('should create a new product-wise coupon', async () => {
      const code = `TEST_PROD_${Date.now()}`;
      const payload = {
        code,
        discount: 50,
        discountType: 'AMOUNT',
        expiryDate: new Date(Date.now() + 86400000).toISOString(),
        type: 'product-wise',
        usageLimit: 50,
        details: {
          productId: 101,
        },
      };

      const response = await supertest(app.server)
        .post('/api/v1/coupons')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body.code).toBe(payload.code);

      // Cleanup
      await prisma.coupon.delete({ where: { code } });
    });
  });

  describe('GET /coupons/:code', () => {
    it('should return a coupon by code', async () => {
      // Setup
      const code = `TEST_GET_${Date.now()}`;
      await prisma.coupon.create({
        data: {
          code,
          discount: 20,
          discountType: 'PERCENTAGE',
          expiryDate: new Date(Date.now() + 86400000),
          type: 'cart-wise',
          usageLimit: 10,
          details: { threshold: 500 },
        },
      });

      const response = await supertest(app.server).get(
        `/api/v1/coupons/code/${code}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.code).toBe(code);

      // Cleanup
      await prisma.coupon.delete({ where: { code } });
    });
  });

  describe('POST /applicable-coupons', () => {
    it('should find applicable coupons for a cart', async () => {
      // Setup a coupon that fits
      const code = `TEST_APP_${Date.now()}`;
      await prisma.coupon.create({
        data: {
          code,
          discount: 10, // 10%
          discountType: 'PERCENTAGE',
          expiryDate: new Date(Date.now() + 86400000),
          type: 'cart-wise',
          usageLimit: 10,
          details: { threshold: 100 },
        },
      });

      const cart = {
        items: [{ productId: 1, name: 'Item 1', price: 200, quantity: 1 }],
        totalPrice: 200,
      };

      const response = await supertest(app.server)
        .post('/api/v1/applicable-coupons')
        .send(cart);

      expect(response.status).toBe(200);
      const applicable = response.body.applicableCoupons;
      expect(Array.isArray(applicable)).toBe(true);
      const found = applicable.find(
        (c: { code: string; calculatedDiscount: number }) => c.code === code,
      );
      expect(found).toBeDefined();
      expect(found.calculatedDiscount).toBe(20); // 10% of 200

      // Cleanup
      await prisma.coupon.delete({ where: { code } });
    });
  });

  describe('POST /apply-coupon/:id', () => {
    it('should apply a specific coupon to the cart', async () => {
      // Setup
      const code = `TEST_APPLY_${Date.now()}`;
      const created = await prisma.coupon.create({
        data: {
          code,
          discount: 50, // Flat 50
          discountType: 'AMOUNT',
          expiryDate: new Date(Date.now() + 86400000),
          type: 'cart-wise',
          usageLimit: 10,
          details: { threshold: 100 },
        },
      });

      const cart = {
        items: [{ productId: 1, name: 'Item 1', price: 200, quantity: 1 }],
        totalPrice: 200,
      };

      const response = await supertest(app.server)
        .post(`/api/v1/apply-coupon/${created.id}`)
        .send(cart);

      expect(response.status).toBe(200);
      expect(response.body.totalDiscount).toBe(50);
      expect(response.body.finalPrice).toBe(150);

      // Cleanup
      await prisma.coupon.delete({ where: { code } });
    });
  });
});
