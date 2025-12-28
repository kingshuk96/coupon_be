import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createCoupon,
  getAllCoupons,
  getCouponByCode,
} from '../services/coupon.service';
import { StatusCodes } from '../constants/enums';
import { Prisma } from '@prisma/client';

export const createCouponHandler = async (
  request: FastifyRequest<{ Body: Prisma.CouponCreateInput }>,
  reply: FastifyReply,
) => {
  try {
    const coupon = await createCoupon(request.body);
    return reply.status(StatusCodes.CREATED).send(coupon);
  } catch (error) {
    request.log.error(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return reply
        .status(StatusCodes.CONFLICT)
        .send({ message: 'Coupon code already exists' });
    }
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

export const getCouponsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const coupons = await getAllCoupons();
    return reply.status(StatusCodes.OK).send(coupons);
  } catch (error) {
    request.log.error(error);
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

export const getCouponHandler = async (
  request: FastifyRequest<{ Params: { code: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { code } = request.params;
    const coupon = await getCouponByCode(code);
    if (!coupon) {
      return reply
        .status(StatusCodes.NOT_FOUND)
        .send({ message: 'Coupon not found' });
    }
    return reply.status(StatusCodes.OK).send(coupon);
  } catch (error) {
    request.log.error(error);
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};
