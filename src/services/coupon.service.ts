import prisma from '../config/db';
import { Coupon, Prisma } from '@prisma/client';

export const createCoupon = async (
  data: Prisma.CouponCreateInput,
): Promise<Coupon> => {
  return await prisma.coupon.create({
    data,
  });
};

export const getCouponByCode = async (code: string): Promise<Coupon | null> => {
  return await prisma.coupon.findUnique({
    where: { code },
  });
};

export const getAllCoupons = async (): Promise<Coupon[]> => {
  return await prisma.coupon.findMany();
};

export const updateCoupon = async (
  id: number,
  data: Prisma.CouponUpdateInput,
): Promise<Coupon> => {
  return await prisma.coupon.update({
    where: { id },
    data,
  });
};

export const deleteCoupon = async (id: number): Promise<Coupon> => {
  return await prisma.coupon.delete({
    where: { id },
  });
};
