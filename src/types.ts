import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    printSimpleRoutes(): void;
  }
}
