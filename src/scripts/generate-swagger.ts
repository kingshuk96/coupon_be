import fs from 'fs';
import path from 'path';
import App from '../app';

const run = async () => {
  try {
    const app = await App();
    await app.ready();
    const swaggerObject = app.swagger();
    const outputPath = path.resolve(__dirname, '../../swagger-output.json');
    fs.writeFileSync(outputPath, JSON.stringify(swaggerObject, null, 2));
    console.log(`Swagger documentation generated at ${outputPath}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
