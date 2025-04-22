// main.ts
import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomResponseInterceptor } from './common/interceptors/CustomResponseInterceptor';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Custom interceptor for http response and request stadardize formatting
  app.useGlobalInterceptors(new CustomResponseInterceptor());
  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.error('Validation errors:', errors);
        return new BadRequestException(errors);
      },
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('API for managing tasks')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local Development') // Add server URL
    .addTag('tasks') // Add tags that match your controller decorators
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
