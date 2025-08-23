import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cors from 'cors';
import helmet from 'helmet';   // ✅ FIXED
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet());   // ✅ works with v7+
  app.use(compression());
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }));
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server running on port ${port}`);
}

bootstrap();
