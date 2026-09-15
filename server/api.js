const express = require("express");
const { metrics, models, alerts, activities } = require("./data");

const router = express.Router();

router.get("/metrics", (req, res) => {
  res.json({
    ...metrics,
    timestamp: new Date().toISOString()
  });
});

router.get("/models", (req, res) => {
  const status = req.query.status;
  const search = String(req.query.search || "").toLowerCase();

  let result = models;
  if (status && status !== "all") result = result.filter(model => model.status === status);
  if (search) {
    result = result.filter(model =>
      `${model.name} ${model.provider} ${model.version}`.toLowerCase().includes(search)
    );
  }
  res.json({ data: result, total: result.length });
});

router.get("/models/:id", (req, res) => {
  const model = models.find(item => item.id === req.params.id);
  if (!model) return res.status(404).json({ error: "Model not found" });
  res.json(model);
});

router.get("/alerts", (req, res) => {
  res.json({ data: alerts, total: alerts.length });
});

router.patch("/alerts/:id/resolve", (req, res) => {
  const alert = alerts.find(item => item.id === req.params.id);
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  alert.resolved = true;
  res.json(alert);
});

router.post("/models", (req, res) => {
  const { name, provider = "Internal", version = "v1.0.0" } = req.body || {};
  if (!name) return res.status(400).json({ error: "Model name is required" });

  const model = {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(),
    name,
    provider,
    version,
    status: "online",
    requests: 0,
    latency: 0,
    errorRate: 0,
    accuracy: 0,
    deployment: "staging"
  };

  models.unshift(model);
  res.status(201).json(model);
});

router.get("/activity", (req, res) => {
  res.json({ data: activities });
});

module.exports = router;