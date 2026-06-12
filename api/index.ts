import { NestFactory } from "@nestjs/core";
import type { IncomingMessage, ServerResponse } from "http";

// Import from the compiled output (produced by `nest build`) so the TypeScript
// decorator metadata required by NestJS dependency injection is preserved.
// The Vercel build runs `npm run build` first (see vercel.json), and the
// relative path lets Vercel's file tracer bundle dist/ into the function.
import { AppModule } from "../dist/app.module";
import { setupApp } from "../dist/setup";

// Cache the express instance across warm invocations.
let cachedHandler:
  | ((req: IncomingMessage, res: ServerResponse) => void)
  | undefined;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
  });
  setupApp(app);
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const h = cachedHandler ?? (cachedHandler = await bootstrap());
  h(req, res);
}
