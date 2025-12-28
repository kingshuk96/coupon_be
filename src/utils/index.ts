import { FastifyInstance } from 'fastify';
import prisma from '../config/db';

export const initDB = async (app: FastifyInstance) => {
  try {
    await prisma.$connect();
    app.log.info('Database connected successfully');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};
