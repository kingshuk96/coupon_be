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

export const cartItemSchema = z.object({
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  totalDiscount: z.number().optional(),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  totalPrice: z.number(),
  totalDiscount: z.number().optional(),
  finalPrice: z.number().optional(),
});

export const applicableCouponSchema = createCouponSchema.extend({
  id: z.number(),
  calculatedDiscount: z.number(),
});

export const applyCouponParamsSchema = z.object({
  id: z.coerce.number(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type ApplicableCoupon = z.infer<typeof applicableCouponSchema>;
export type ApplyCouponParams = z.infer<typeof applyCouponParamsSchema>;
