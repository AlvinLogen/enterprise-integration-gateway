import { randomUUID } from "node:crypto";

export function registerLogging(app) {
  app.addHook("onRequest", async (req) => {
    const incoming = req.headers["x-correlation-id"];
    req.correlationId =
      typeof incoming === "string" && incoming.length > 0
        ? incoming
        : randomUUID();
  });

  app.addHook("onResponse", async (req, reply) => {
    app.log.info({
      msg: "request",
      correlationId: req.correlationId,
      method: req.method,
      url: req.url,
      status: reply.statusCode,
      durationMs: Math.round(reply.elapsedTime),
    });
  });

  app.addHook("onSend", async (req, reply, payload) => {
    reply.header("x-correlation-id", req.correlationId);
    return payload;
  });
}
