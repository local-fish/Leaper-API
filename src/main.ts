import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import App from '#common/app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

if (process.env.DEV === 'true') console.warn('Running in development mode')

async function bootstrap() {
  const app = await NestFactory.create(App);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))

  if (process.env.DEV === 'true') {
    const swaggerDoc = new DocumentBuilder()
    .setTitle('Leaper')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()

    SwaggerModule.setup('swagger', app, () => SwaggerModule.createDocument(app, swaggerDoc))
    console.log('Swagger applied')
  }



  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
