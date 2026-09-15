const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const apiRouter = require("./api");
const { metrics, models, activities } = require("./data");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));
app.use("/api", apiRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ai-ops-control-center", timestamp: new Date().toISOString() });
});

wss.on("connection", ws => {
  ws.send(JSON.stringify({
    type: "connection",
    status: "connected",
    timestamp: new Date().toISOString()
  }));
});

function randomBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function broadcast(payload) {
  const message = JSON.stringify(payload);
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(message);
  });
}

setInterval(() => {
  metrics.gpuUtilization = Math.max(35, Math.min(97, metrics.gpuUtilization + randomBetween(-4, 4)));
  metrics.cpuUtilization = Math.max(25, Math.min(92, metrics.cpuUtilization + randomBetween(-3, 3)));
  metrics.memoryUtilization = Math.max(35, Math.min(90, metrics.memoryUtilization + randomBetween(-2, 2)));
  metrics.latency = Math.max(90, Math.min(700, metrics.latency + randomBetween(-18, 22)));
  metrics.requests += randomBetween(90, 340);
  metrics.tokensPerMinute = Math.max(500000, metrics.tokensPerMinute + randomBetween(-18000, 24000));

  const model = models[randomBetween(0, models.length - 1)];
  const eventTypes = [
    ["INFERENCE", `${model.name} inference completed`],
    ["REQUEST", `${model.name} request received`],
    ["HEALTH", `${model.name} health check passed`],
    ["SEARCH", `${model.name} vector search completed`]
  ];
  const [type, message] = eventTypes[randomBetween(0, eventTypes.length - 1)];

  const activity = {
    type,
    message,
    model: model.name,
    timestamp: new Date().toISOString()
  };

  activities.unshift({ type, message, model: model.name });
  if (activities.length > 50) activities.pop();

  broadcast({
    type: "telemetry",
    metrics: { ...metrics },
    activity
  });
}, 2200);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AI Ops Control Center running at http://localhost:${PORT}`);
});