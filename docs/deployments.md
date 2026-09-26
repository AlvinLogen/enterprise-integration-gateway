# Deployment - Enterprise Integration Gateway (I1)

## Pre-requisites

- Docker Desktop (Windows) or Docker Engine + compose plugin (Linux)
- Ports free: 1433 (SQL), 3000 (API), 8080 (Gateway)

# Windows (Dell Optiplex 3000, Win 11)

```powershell
Copy-Item services/api/.env.example services/api/.env #then edit values
docker compose up -d --build
Invoke-RestMethod http://localhost:8080/health
```

## Linx (NAS / Server)

```bash
cp services/api/.env.example services/api/.env #then edit values
docker compose up -d --build
curl -s http://localhost:8080/health | jq
```

## Verify

- `docker compose ps` - all services `health`
- `GET /health` via gateway returns {status: "ok", uptime: version}
- Ops-UI at http://localhost:5500 shows "Healthy"

## Teardown

```bash
docker compose down    # stop & remove containers
docker compose down -v # also remove the SQL data volume (destructive)
```
