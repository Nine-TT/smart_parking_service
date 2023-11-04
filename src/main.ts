import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as http from 'http';
import * as cors from 'cors';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(
    new IoAdapter(http.createServer(app.getHttpServer())),
  );
  app.setGlobalPrefix('api/v1');

  app.use(
    cors({
      origin: '*', // Đặt origin của client
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Nếu bạn muốn bao gồm cookies
    }),
  );

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Smart Parking Service')
    .setDescription(
      'A smart parking service utilizes technology to efficiently manage and optimize parking spaces, enhancing convenience and reducing congestion.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
