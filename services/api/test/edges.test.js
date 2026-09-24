import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

//Security
test("request body over the 64KB limit is rejected", async () => {
  const app = buildApp({ logLevel: "silent" });
  const huge = "x".repeat(70 * 1024);
  const res = await app.inject({
    method: "POST",
    url: "/v1/assets",
    payload: { name: huge, kind: "device" },
  });

  assert.ok(res.statusCode === 413 || res.statusCode === 400);
  await app.close();
});

// Reliability 
test("missing required field yields problem+json 400", async () => {
  const app = buildApp({ logLevel: "silent" });
  const res = await app.inject({
    method: "POST",
    url: "/v1/assets",
    payload: { kind: "device" },
  });
  assert.equal(res.statusCode, 400);
  assert.match(res.headers["content-type"], /application\/problem\+json/);
  const body = res.json();
  assert.equal(body.status, 400);
  await app.close();
});

//Interoperability
test("correlation id is echoed back", async () => {
  const app = buildApp({ logLevel: "silent" });
  const res = await app.inject({
    method: "GET",
    url: "/health",
    headers: { "x-correlation-id": "trace-xyz" },
  });
  assert.equal(res.headers["x-correlation-id"], "trace-xyz");
  await app.close();
});
