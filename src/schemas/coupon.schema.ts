import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string(),
  discount: z.number().int(),
  expiryDate: z.string().datetime(),
  type: z.string(),
  discountType: z
    .enum(['PERCENTAGE', 'AMOUNT'])
    .optional()
    .default('PERCENTAGE'),
  usageLimit: z.number().int(),
  details: z.any().optional(),
});

export const getCouponParamsSchema = z.object({
  code: z.string(),
});

export const updateCouponSchema = createCouponSchema.partial();
