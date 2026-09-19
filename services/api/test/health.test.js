import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

test("GET /health returns status ok", async () => {
  const app = buildApp({ logLevel: "silent" });

  const res = await app.inject({ method: "GET", url: "/health" });
  assert.equal(res.statusCode, 200);

  const body = res.json();
  assert.equal(body.status, "ok");
  assert.equal(typeof body.uptime, "number");
  await app.close();
});
