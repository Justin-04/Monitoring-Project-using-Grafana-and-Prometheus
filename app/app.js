const express = require("express");
const client = require("prom-client");
const app = express();

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpReqsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "code"],
});

app.get("/", (_req, res) => res.send("NodeJS + Grafana + Prometheus"));
app.get("/error", (_req, res) => res.status(500).send("Intentional 500"));

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on ${port}`));
