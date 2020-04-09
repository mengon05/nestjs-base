import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const serverCfg = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: serverCfg.whitelist,
  });
  const port = process.env.PORT || serverCfg.port;
  await app.listen(port);
  logger.log(`Application started at port ${port}`);
}

bootstrap();
