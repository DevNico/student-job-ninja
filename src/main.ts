import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.use(function (req, res, next) {
    res.header('x-powered-by', '');
    next();
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('JS-SS21 API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('students')
    .addTag('companies')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  writeFileSync('./openapi.json', JSON.stringify(document));

  if (process.env['openapi']) {
    process.exit();
  }

  await app.listen(process.env.APPLICATION_PORT);
}
bootstrap();
