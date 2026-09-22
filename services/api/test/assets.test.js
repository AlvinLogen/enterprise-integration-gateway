import { test } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/app.js";

test("POST /v1/assets rejects invalid kind with 400 problem+json", async () => {
  const app = buildApp({ logLevel: "silent" });
  const res = await app.inject({
    method: "POST",
    url: "/v1/assets",
    payload: { name: "MRI-1", kind: "not-a-kind" },
  });
  assert.equal(res.statusCode, 400);
  assert.match(res.headers["content-type"], /application\/problem\+json/);

  await app.close();
});

test("unknown route returns 404 problem+json", async () => {
  const app = buildApp({ logLevel: "silent" });
  const res = await app.inject({ method: "GET", url: "/nope" });
  assert.equal(res.statusCode, 404);

  const body = res.json();
  assert.equal(body.status, 404);

  await app.close();
});
