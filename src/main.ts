import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');

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

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
