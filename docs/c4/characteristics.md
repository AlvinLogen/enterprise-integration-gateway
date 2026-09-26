# Architecture Characteristics - I1 Asset Interface

## TOP 4 MUST NOT FAIL

**Security (Structural)** — untrusted callers; PHI-adjacent domain. JWT + scopes at the gateway, Zod + parameterised SQL at the service, RFC 7807 error hygiene.
**Interoperability (Cross-Cutting)** — the whole point is integration. OpenAPI contract, stable { data, meta } / problem+json shapes, ISO-8601 UTC, explicit Content-Type.
**Reliability (Operational)** — fail-fast config, timeouts, graceful shutdown, health, soft deletes for recoverability.
**Observability (Cross-Cutting)** — correlation id + structured logs.

## Explicitly de-prioritised (for now)

- **Elasticity / high scalability** — single instance is fine; no fan-out yet.
- **Performance (sub-10ms)** — good-enough latency; correctness first.

## How each is measured / enforced

| Characteristic   | Enforced by                                   | Evidence            |
| ---------------- | --------------------------------------------- | ------------------- |
| Security         | Gateway JWT+scopes; Zod; parameterised SQL    | negative tests, CI  |
| Interoperability | OpenAPI; envelope shapes; problem+json        | Newman assertions   |
| Reliability      | env-validate; timeouts; SIGTERM drain; health | health test, review |
| Observability    | correlation id; structured logs               | log inspection      |
