// import { Prisma, Coupon, DiscountType } from '@prisma/client';
import { Coupon } from 'schemas/zod-prisma';
import prisma from '../config/db';
import {
  Cart,
  CreateCouponInput,
  UpdateCouponInput,
} from '../schemas/coupon.schema';

const createCoupon = async (data: CreateCouponInput): Promise<Coupon> => {
  return await prisma.coupon.create({
    data: {
      ...data,
      expiryDate: new Date(data.expiryDate),
    },
  });
};

const getCouponByCode = async (code: string): Promise<Coupon | null> => {
  return await prisma.coupon.findUnique({
    where: { code },
  });
};
const getCouponById = async (id: number): Promise<Coupon | null> => {
  return await prisma.coupon.findUnique({
    where: { id },
  });
};
const getAllCoupons = async (): Promise<Coupon[]> => {
  return await prisma.coupon.findMany();
};

const updateCoupon = async (
  id: number,
  data: UpdateCouponInput,
): Promise<Coupon> => {
  const updateData: UpdateCouponInput = {
    ...data,
  };

  // if (data.expiryDate) {
  //   updateData.expiryDate = new Date(data.expiryDate);
  // }

  return await prisma.coupon.update({
    where: { id },
    data: updateData,
  });
};

const deleteCoupon = async (id: number): Promise<Coupon> => {
  return await prisma.coupon.delete({
    where: { id },
  });
};

// --- Coupon Logic ---

interface BxGyDetails {
  buyProducts: number[];
  buyQuantity: number;
  getProducts: number[];
  getQuantity: number;
  repetitionLimit: number;
}

interface CartWiseDetails {
  threshold: number;
}

interface ProductWiseDetails {
  productId: number;
}

const calculateDiscount = (
  coupon: Coupon,
  cart: Cart,
): { discount: number; updatedCart?: Cart } => {
  let discount = 0;
  const { type, details, discount: couponDiscountValue, discountType } = coupon;

  // Clone cart to avoid mutation if needed, though we will return a new structure mostly
  const items = cart.items.map((item) => ({ ...item }));
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Normalize type string
  const couponType = type.toLowerCase();

  if (couponType === 'cart-wise') {
    const d = details as unknown as CartWiseDetails;
    if (totalPrice > d.threshold) {
      if (discountType === 'PERCENTAGE') {
        discount = (totalPrice * couponDiscountValue) / 100;
      } else {
        discount = couponDiscountValue;
      }
    }
  } else if (couponType === 'product-wise') {
    const d = details as unknown as ProductWiseDetails;
    const item = items.find((i) => i.productId === d.productId);
    if (item) {
      const itemTotal = item.price * item.quantity;
      if (discountType === 'PERCENTAGE') {
        discount = (itemTotal * couponDiscountValue) / 100;
      } else {
        // Amount discount per item total or per unit?
        // Usually "Apply a discount to specific products" means total discount on those products.
        // Assuming amount off the total price of that product line
        discount = Math.min(itemTotal, couponDiscountValue);
      }
    }
  } else if (couponType === 'bxgy') {
    const d = details as unknown as BxGyDetails;

    // Count buy items
    let buyCount = 0;
    d.buyProducts.forEach((pid) => {
      const item = items.find((i) => i.productId === pid);
      if (item) buyCount += item.quantity;
    });

    const sets = Math.floor(buyCount / d.buyQuantity);
    const applicableSets = Math.min(sets, d.repetitionLimit);

    if (applicableSets > 0) {
      // Calculate discount based on "get" products
      // "get 1 of Product P and Product Q free" -> for each set, 1 P and 1 Q are free.
      d.getProducts.forEach((pid) => {
        const item = items.find((i) => i.productId === pid);
        if (item) {
          const freeQty = applicableSets * d.getQuantity;
          const globalFreeQty = Math.min(item.quantity, freeQty);
          discount += globalFreeQty * item.price;
        }
      });
    }
  }

  // Update Cart items with discount info for 'applyCoupon' usage
  // For cart-wise, we distribute or just set total. The requirement says "updated cart with discounted prices for each item".
  // We will simply apply a proportional discount for cart-wise, specific for product-wise.

  if (couponType === 'cart-wise' && discount > 0) {
    const ratio = discount / totalPrice;
    items.forEach((item) => {
      const itemShare = item.price * item.quantity * ratio;
      item.totalDiscount = (item.totalDiscount || 0) + itemShare;
    });
  } else if (couponType === 'product-wise' && discount > 0) {
    const d = details as unknown as ProductWiseDetails;
    const item = items.find((i) => i.productId === d.productId);
    if (item) {
      item.totalDiscount = (item.totalDiscount || 0) + discount;
    }
  } else if (couponType === 'bxgy' && discount > 0) {
    const d = details as unknown as BxGyDetails;
    // We need to re-calculate which items got free to attribute discount
    // A deeper implementation would track exactly which lines generated the discount.
    // Re-running logic briefly for attribution:
    let buyCount = 0;
    d.buyProducts.forEach((pid) => {
      const item = items.find((i) => i.productId === pid);
      if (item) buyCount += item.quantity;
    });
    const sets = Math.floor(buyCount / d.buyQuantity);
    const applicableSets = Math.min(sets, d.repetitionLimit);

    d.getProducts.forEach((pid) => {
      const item = items.find((i) => i.productId === pid);
      if (item) {
        const freeQty = applicableSets * d.getQuantity;
        const globalFreeQty = Math.min(item.quantity, freeQty);
        const itemDiscount = globalFreeQty * item.price;
        item.totalDiscount = (item.totalDiscount || 0) + itemDiscount;
      }
    });
  }

  return {
    discount,
    updatedCart: {
      items,
      totalPrice,
      totalDiscount: discount,
      finalPrice: totalPrice - discount,
    },
  };
};

const getApplicableCoupons = async (cart: Cart) => {
  const coupons: Coupon[] = await prisma.coupon.findMany({
    where: {
      expiryDate: {
        gt: new Date(),
      },
    },
  });

  const applicableCoupons: {
    id: number;
    calculatedDiscount: number;
    type: string;
    code: string;
    discount: number;
    discountType: 'PERCENTAGE' | 'AMOUNT';
  }[] = [];

  // Helper to check validity simply
  // Actually simpler to just run calculateDiscount and check if > 0
  // But some might be applicable but result in 0 discount? (e.g. 0% discount)
  // Assuming applicable means discount > 0

  for (const coupon of coupons) {
    const { discount } = calculateDiscount(coupon, cart);
    if (discount > 0) {
      applicableCoupons.push({
        id: coupon.id,
        calculatedDiscount: discount,
        type: coupon.type,
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        // Add other coupon fields if needed by schema
      });
    }
  }

  // Schema expects `applicableCouponSchema` which extends createCouponSchema + id + calculatedDiscount
  // We need to map correctly to return full coupon objects
  return applicableCoupons.map((ac) => {
    const coupon = coupons.find((c) => c.id === ac.id)!;
    return {
      ...coupon,
      calculatedDiscount: ac.calculatedDiscount,
    };
  });
};

const applyCoupon = async (id: number, cart: Cart): Promise<Cart | null> => {
  const coupon = await getCouponById(id);
  if (!coupon) return null;

  // Check expiry
  if (new Date() > coupon.expiryDate) {
    throw new Error('Coupon expired');
  }

  const { updatedCart } = calculateDiscount(coupon, cart); //discount

  // If no discount applicable, should we throw or return cart as is?
  // "Apply a specific coupon... return updated cart"
  // We'll return the updated cart.

  return updatedCart!;
};

export {
  createCoupon,
  getCouponByCode,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  getApplicableCoupons,
  applyCoupon,
};
