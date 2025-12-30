import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponByCode,
  getCouponById,
  updateCoupon,
  getApplicableCoupons,
  applyCoupon,
} from '../services/coupon.service';
import { StatusCodes } from '../constants/enums';
import {
  Cart,
  CreateCouponInput,
  UpdateCouponInput,
} from '../schemas/coupon.schema';

const createCouponHandler = async (
  request: FastifyRequest<{ Body: CreateCouponInput }>,
  reply: FastifyReply,
) => {
  try {
    const coupon = await createCoupon(request.body);
    return reply.status(StatusCodes.CREATED).send(coupon);
  } catch (error) {
    request.log.error(error);

    return reply
      .status(StatusCodes.CONFLICT)
      .send({ message: 'Coupon code already exists' });
  }
};

const getCouponsHandler = async (
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
const getCouponHandler = async (
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
const getCouponByIdHandler = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const coupon = await getCouponById(id);
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
const updateCouponHandler = async (
  request: FastifyRequest<{
    Params: { id: number };
    Body: UpdateCouponInput;
  }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const coupon = await updateCoupon(Number(id), request.body);
    return reply.status(StatusCodes.OK).send(coupon);
  } catch (error) {
    request.log.error(error);
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

const deleteCouponHandler = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const coupon = await deleteCoupon(Number(id));
    return reply.status(StatusCodes.OK).send(coupon);
  } catch (error) {
    request.log.error(error);
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

const getApplicableCouponsHandler = async (
  request: FastifyRequest<{ Body: Cart }>,
  reply: FastifyReply,
) => {
  try {
    const coupons = await getApplicableCoupons(request.body);
    return reply.status(StatusCodes.OK).send({ applicableCoupons: coupons });
  } catch (error) {
    request.log.error(error);
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

const applyCouponHandler = async (
  request: FastifyRequest<{ Params: { id: number }; Body: Cart }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const updatedCart = await applyCoupon(Number(id), request.body);
    return reply.status(StatusCodes.OK).send(updatedCart);
  } catch (error) {
    request.log.error(error);
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

export {
  createCouponHandler,
  getCouponsHandler,
  getCouponHandler,
  getCouponByIdHandler,
  updateCouponHandler,
  deleteCouponHandler,
  getApplicableCouponsHandler,
  applyCouponHandler,
};
