import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: [
      process.env.FRONTEND_CLIENTE_URL ?? "http://localhost:3000",
      process.env.FRONTEND_INTERNO_URL ?? "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix("api");

  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("EncerraDigital API")
      .setDescription("Sistema de encerramento digital de conta corrente — BRF")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    SwaggerModule.setup(
      "api/docs",
      app,
      SwaggerModule.createDocument(app, config),
    );
  }

  // Railway injeta PORT automaticamente; BACKEND_PORT é usado em desenvolvimento local
  const porta = process.env.PORT ?? process.env.BACKEND_PORT ?? 3333;
  await app.listen(porta);
  console.log(`✅ Backend rodando em http://localhost:${porta}`);
  console.log(`📖 Swagger em http://localhost:${porta}/api/docs`);
}

bootstrap();
