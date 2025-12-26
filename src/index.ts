import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import pool from './config/db';
import dotenv from 'dotenv';
dotenv.config();

const server: FastifyInstance = Fastify({
    logger: true
});

const port = parseInt(process.env.PORT || '3000');

server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Coupon Backend is running!' };
});

server.get('/test-db', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const result = await pool.query('SELECT NOW()');
        return { message: 'Database connected successfully', time: result.rows[0].now };
    } catch (err) {
        server.log.error(err);
        reply.status(500).send({ error: 'Database connection failed' });
    }
});

const start = async () => {
    try {
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server is running at http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
