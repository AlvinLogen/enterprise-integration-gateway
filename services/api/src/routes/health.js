const startedAt = Date.now();

export async function healthRoutes(app) {
  app.get("/health", async () => ({
    status: "ok",
    uptime: Math.round((Date.now() - startedAt) / 1000),
    version: process.env.npm_package_version ?? "1.0.0",
  }));
}
