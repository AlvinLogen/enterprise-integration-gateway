const GATEWAY = "http://localhost:8000";
let seen = 0;

const $ = (id) => document.getElementById(id);

async function poll() {
  try {
    const res = await fetch(`${GATEWAY}/health`, {
      headers: { "X-Correlation-Id": crypto.randomUUID() },
    });
    const body = await res.json();
    seen += 1;
    $("status").textContent = res.ok ? "Healthy" : "Unhealthy";
    $("status").className = res.ok ? "ok" : "bad";
    $("uptime").textContent = String(body.uptime ?? "-");
    $("version").textContent = String(body.version ?? "-");
    $("count").textContent = String(seen);
  } catch (error) {
    $("status").textContent = "Unreachable";
    $("status").className = "bad";
  }
}

poll();
setInterval(poll, 5000);
