import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import App from '#common/app';

if (process.env.DEV) console.warn('Running in development mode')

const app = await NestFactory.create(App);
app.useGlobalPipes(new ValidationPipe({
	whitelist: true,
	forbidNonWhitelisted: true,
	transform: true
}))
await app.listen(process.env.PORT ?? 4000);
