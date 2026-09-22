import { createHmac } from "node:crypto";

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const secret = Buffer.from(
  "c2VjcmV0LWtleS1mb3ItaTEtZGV2LW9ubHktMzJieXRlcw",
  "base64url",
);
const header = b64({
  alg: "HS256",
  typ: "JWT",
  kid: "dev",
});
const payload = b64({
  sub: "dev",
  scope: ["assets:read", "assets:write"],
  exp: Math.floor(Date.now() / 1000) + 3600,
});
const sig = createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
console.log(`${header}.${payload}.${sig}`)
