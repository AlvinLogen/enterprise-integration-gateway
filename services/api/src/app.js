import Fastify from "fastify";
import { registerLogging } from "./plugins/logging.js";
import { registerErrorHandler } from "./plugins/errors.js";
import { healthRoutes } from "./routes/health.js";
import { assetRoutes } from "./routes/assets.js";

export function buildApp(opts = {}) {
  const app = Fastify({
    logger: { level: opts.logLevel ?? "info" },
    bodyLimit: 64 * 1024,
    genReqId: () => undefined,
  });

  registerLogging(app);
  registerErrorHandler(app);
  app.register(healthRoutes);
  app.register(assetRoutes, { prefix: "/v1" });

  return app;
}
