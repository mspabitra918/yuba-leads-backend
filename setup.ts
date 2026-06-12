import { INestApplication, ValidationPipe } from "@nestjs/common";

/**
 * Shared application configuration used by both the local server (main.ts)
 * and the Vercel serverless entry point (api/index.ts).
 */
export function setupApp(app: INestApplication): void {
  app.setGlobalPrefix("api");

  // CORS origins are comma-separated in the CORS_ORIGIN env var.
  // Falls back to the local Next.js dev server.
  const origins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : ["http://localhost:3000"];

  app.enableCors({ origin: origins, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
