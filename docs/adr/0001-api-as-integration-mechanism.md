# ADR 0001 — Synchronous REST behind a managed gateway as the integration mechanism

- Status: Accepted
- Date: 2026-09-22
- Deciders: Alvin
- Work item: AB#1

## Context

The asset/patient-lite domain must be exposed for integration. The candidate
mechanisms are: synchronous REST API, asynchronous message queue, event stream,
scheduled batch, or file drop. For this slice the consumer needs an immediate,
request/response read and write of a single resource, with per-caller
authorisation and low latency. There is no high-volume fan-out or long-running
workflow yet.

## Decision

Expose a synchronous REST API (`/v1/assets`) fronted by KrakenD CE. The gateway
owns edge concerns (JWT validation, rate-limiting, request-size, timeouts, CORS);
the Node service owns business logic, validation, and persistence. The contract
is defined OpenAPI-first.

## Consequences

Positive:

- Simplest mechanism that satisfies the actual requirement (anti-over-engineering).
- Strong interoperability: any HTTP client integrates against the OpenAPI contract.
- Clear separation: edge policy at the gateway, logic in the service.
  Negative / trade-offs:
- Synchronous coupling: a slow/absent backend surfaces to the caller (mitigated
  by timeouts + health).
- No built-in buffering or replay; unsuitable for high-volume async workflows —
  a future ADR will introduce a queue when that requirement appears.

## Alternatives considered

- Message queue: rejected now — no async/decoupling/buffering requirement yet;
  would be over-engineering for a request/response read.
- Batch/file: rejected — needs near-real-time single-record access.
