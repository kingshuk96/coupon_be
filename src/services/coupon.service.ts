import { Coupon } from 'schemas/zod-prisma';
import prisma from '../config/db';
import {
  Cart,
  CreateCouponInput,
  UpdateCouponInput,
} from '../schemas/coupon.schema';

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

const calculateDiscount = (
  coupon: Coupon,
  cart: Cart,
): { discount: number; updatedCart?: Cart } => {
  let discount = 0;
  const { type, details, discount: couponDiscountValue, discountType } = coupon;

  // Clone cart
  const items = cart.items.map((item) => ({ ...item }));
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const couponType = type.toLowerCase();

  if (couponType === 'cart-wise') {
    const couponDetails = details as unknown as CartWiseDetails;
    if (totalPrice > couponDetails.threshold) {
      if (discountType === 'PERCENTAGE') {
        discount = (totalPrice * couponDiscountValue) / 100;
      } else {
        discount = couponDiscountValue;
      }
    }
  } else if (couponType === 'product-wise') {
    const couponDetails = details as unknown as ProductWiseDetails;
    const item = items.find((i) => i.productId === couponDetails.productId);
    if (item) {
      const itemTotal = item.price * item.quantity;
      if (discountType === 'PERCENTAGE') {
        discount = (itemTotal * couponDiscountValue) / 100;
      } else {
        discount = Math.min(itemTotal, couponDiscountValue);
      }
    }
  } else if (couponType === 'bxgy') {
    const couponDetails = details as unknown as BxGyDetails;

    let buyCount = 0;
    couponDetails.buyProducts.forEach((pid) => {
      const item = items.find((i) => i.productId === pid);
      if (item) buyCount += item.quantity;
    });

    const sets = Math.floor(buyCount / couponDetails.buyQuantity);
    const applicableSets = Math.min(sets, couponDetails.repetitionLimit);

    if (applicableSets > 0) {
      couponDetails.getProducts.forEach((pid) => {
        const item = items.find((i) => i.productId === pid);
        if (item) {
          const freeQty = applicableSets * couponDetails.getQuantity;
          const globalFreeQty = Math.min(item.quantity, freeQty);
          discount += globalFreeQty * item.price;
        }
      });
    }
  }

  if (couponType === 'cart-wise' && discount > 0) {
    const ratio = discount / totalPrice;
    items.forEach((item) => {
      const itemShare = item.price * item.quantity * ratio;
      item.totalDiscount = (item.totalDiscount || 0) + itemShare;
    });
  } else if (couponType === 'product-wise' && discount > 0) {
    const couponDetails = details as unknown as ProductWiseDetails;
    const item = items.find((i) => i.productId === couponDetails.productId);
    if (item) {
      item.totalDiscount = (item.totalDiscount || 0) + discount;
    }
  } else if (couponType === 'bxgy' && discount > 0) {
    const couponDetails = details as unknown as BxGyDetails;
    let buyCount = 0;
    couponDetails.buyProducts.forEach((pid) => {
      const item = items.find((i) => i.productId === pid);
      if (item) buyCount += item.quantity;
    });
    const sets = Math.floor(buyCount / couponDetails.buyQuantity);
    const applicableSets = Math.min(sets, couponDetails.repetitionLimit);

    couponDetails.getProducts.forEach((pid) => {
      const item = items.find((i) => i.productId === pid);
      if (item) {
        const freeQty = applicableSets * couponDetails.getQuantity;
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

  if (new Date() > coupon.expiryDate) {
    throw new Error('Coupon expired');
  }

  const { updatedCart } = calculateDiscount(coupon, cart);
  if (!updatedCart) {
    throw new Error('No discount applicable');
  }

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
