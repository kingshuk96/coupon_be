import fastify from 'fastify';
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { StatusCodes } from '@constants/enums';
// import { swaggerSpec } from './swagger';
import routes from '@routes/index';

const App = async (options: FastifyServerOptions = {}) => {
  const app: FastifyInstance = fastify(options);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const simpleRoutes: string[] = [];
  app.addHook('onRoute', (opts) => {
    if (opts.url.startsWith('/documentation') || opts.url.startsWith('/static'))
      return;
    if (opts.method === 'HEAD' || opts.method === 'OPTIONS') return;
    const methods = Array.isArray(opts.method) ? opts.method : [opts.method];
    methods.forEach((m) =>
      simpleRoutes.push(`${m.toString().toUpperCase().padEnd(7)} ${opts.url}`),
    );
  });
  app.decorate('printSimpleRoutes', () => {
    console.log(simpleRoutes.sort().join('\n'));
  });

  app.register(cors);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Coupon System API',
        description: 'API documentation for the Coupon System',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
  });

  app.register(routes, { prefix: 'api/v1' });

  app.setErrorHandler((error, _req: FastifyRequest, rep: FastifyReply) => {
    if (error instanceof ZodError) {
      app.log.error(error);
      return rep.status(StatusCodes.BAD_REQUEST).send({
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'BAD_REQUEST',
        error: 'Bad Request',
        message: JSON.parse(error.message),
      });
    }
    app.log.error(error);
    return rep.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  });

  return app;
};

export default App;
