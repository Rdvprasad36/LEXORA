# ADR 0005: Schema Validation and Repair

## Status
Accepted

## Context
Model outputs can occasionally drift from required JSON structures.

## Decision
Enforce strict schema validation using `response_json_schema` combined with Ajv validation on the server, with a single repair-retry loop on schema failure.

## Consequences
- Guaranteed structural integrity before returning results to the client.
