import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Cloudinary from './common/config/cloudinary';

const PORT = process.env.PORT || 5500;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // connect to cloudinary
  Cloudinary();
  await app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
}
bootstrap();
