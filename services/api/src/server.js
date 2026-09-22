import { buildApp } from "./app.js";
import { loadEnv } from "./config/env.js";

const env = loadEnv();
const app = buildApp();

async function shutdown(signal) {
  app.log.info({ msg: "shutdown", signal });

  try {
    await app.close();
    process.exit(0);
  } catch (error) {
    app.log.error({ msg: "shutdown-failed", error });
    process.exit(1);
  }
}

for (const sig of ["SIGTERM", "SIGINT"]) {
  process.on(sig, () => shutdown(sig));
}

app.listen({ port: env.PORT, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
