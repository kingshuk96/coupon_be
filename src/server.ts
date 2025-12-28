import './types';
import App from '@app';
import { AppEnv, env, fastifyConfig } from '@config';
import { initDB } from '@utils';

(async () => {
  const app = await App(fastifyConfig);

  // Initialize the database connection
  await initDB(app);
  try {
    await app.listen({ port: Number(env.APP_PORT), host: '0.0.0.0' });

    app.log.info('mode : %s', env.APP_ENV);
    if (env.APP_ENV === AppEnv.DEVELOPMENT) {
      app.printSimpleRoutes();
    }
  } catch (err) {
    app.log.fatal(err);
    process.exit(1);
  }
})();
