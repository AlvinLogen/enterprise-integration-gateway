export function registerErrorHandler(app) {
  app.setErrorHandler((err, req, reply) => {
    const status =
      err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

    if (status >= 500) {
      app.log.error({
        msg: "unhandled",
        correlationId: req.correlationId,
        err,
      });
    }

    reply
      .code(status)
      .type("application/problem+json")
      .send({
        type: err.type ?? "about:blank",
        title:
          err.title ?? (status >= 500 ? "Internal Server Error" : err.message),
        status,
        detail: status >= 500 ? "An unexpected error occurred." : err.message,
        instance: req.url,
        correlationId: req.correlationId,
      });
  });

  app.setNotFoundHandler((req, reply) => {
    reply
      .code(404)
      .type("application/problem+json")
      .send({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: `No route for ${req.method} ${req.url}`,
        instance: req.url,
        correlationId: req.correlationId,
      });
  });
}
