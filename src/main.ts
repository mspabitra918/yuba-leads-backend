import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  const origins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim());

  app.enableCors({
    origin: origins,
    methods: ["GET", "POST"],
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("Yuba Leads Intake API")
    .setDescription("API documentation for Yuba Leads")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);

  console.log(`Yuba Leads intake API listening on http://localhost:${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
}

bootstrap();
