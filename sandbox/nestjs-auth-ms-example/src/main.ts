import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SourceLoop } from './sourceloop';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare global {
  // eslint-disable-next-line no-var
  var sourceloop: SourceLoop;
}

global.sourceloop = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS x SourceLoop')
    .setDescription('Trying out sourceloop with nestjs')
    .setVersion('1.0')
    .addTag('NestJS Routes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.DEFAULT_SWAGGER_ROUTE, app, document);

  sourceloop = new SourceLoop();
  for (const service of sourceloop.services) {
    await service.boot();
    const swaggerPath = `${process.env.DEFAULT_SWAGGER_ROUTE ?? 'swagger'}/${
      service.swaggerPath
    }`;
    SwaggerModule.setup(
      swaggerPath,
      app,
      await service.appInstance.restServer.getApiSpec(),
    );
  }
  global.sourceloop = sourceloop;

  await app.listen(4000);
}
bootstrap();
