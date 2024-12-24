import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './infras/common/filters/NotFoundExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Online Book')
    .setDescription('Online Book API')
    .setVersion('1.0')
    .addTag('Books')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.useGlobalFilters(new NotFoundExceptionFilter());

  app.enableCors({
    origin: '*',  // Accepte toutes les origines
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(3000, "0.0.0.0");
}
bootstrap();
