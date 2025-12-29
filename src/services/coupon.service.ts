import prisma from '../config/db';
import { Coupon, Prisma } from '@prisma/client';

const createCoupon = async (
  data: Prisma.CouponCreateInput,
): Promise<Coupon> => {
  return await prisma.coupon.create({
    data,
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
  data: Prisma.CouponUpdateInput,
): Promise<Coupon> => {
  return await prisma.coupon.update({
    where: { id },
    data,
  });
};

const deleteCoupon = async (id: number): Promise<Coupon> => {
  return await prisma.coupon.delete({
    where: { id },
  });
};

export {
  createCoupon,
  getCouponByCode,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCouponById,
};
