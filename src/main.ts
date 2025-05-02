import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Centralized Media Store API's")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('docs', app, document)

  app.enableCors()

  app.use(json({ limit: '50mb' }))

  app.use(urlencoded({ extended: true, limit: '50mb' }))

  await app.listen(process.env.PORT);

}
bootstrap();
