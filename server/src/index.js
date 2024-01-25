import app from './app.js';
import env from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import ensureAdmin from './scripts/ensureAdmin.js';

async function bootstrap() {
  await connectDatabase();
  await ensureAdmin();

  const server = app.listen(env.port, () => {
    console.log(`Server ishga tushdi: http://localhost:${env.port} [${env.nodeEnv}]`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} qabul qilindi, server to'xtatilmoqda...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((error) => {
  console.error('Serverni ishga tushirib bo\'lmadi:', error);
  process.exit(1);
});
