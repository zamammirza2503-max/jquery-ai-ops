const metrics = {
  requests: 124892,
  latency: 184,
  errorRate: 0.42,
  gpuUtilization: 73,
  cpuUtilization: 61,
  memoryUtilization: 68,
  tokensPerMinute: 842000,
  uptime: 99.97
};

const models = [
  { id: "llama-31", name: "Llama 3.1", provider: "Meta", version: "v3.1.4", status: "online", requests: 84291, latency: 182, errorRate: 0.21, accuracy: 94.8, deployment: "production" },
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral AI", version: "v2.8.1", status: "online", requests: 31822, latency: 214, errorRate: 0.31, accuracy: 93.6, deployment: "production" },
  { id: "vision-pro", name: "Vision Pro", provider: "Internal", version: "v1.4.2", status: "warning", requests: 8912, latency: 641, errorRate: 1.18, accuracy: 91.7, deployment: "production" },
  { id: "embed-xl", name: "Embeddings XL", provider: "Internal", version: "v2.1.0", status: "online", requests: 52102, latency: 76, errorRate: 0.09, accuracy: 97.2, deployment: "production" },
  { id: "reranker", name: "Reranker", provider: "Internal", version: "v1.9.3", status: "online", requests: 23118, latency: 91, errorRate: 0.13, accuracy: 96.1, deployment: "production" },
  { id: "text-classifier", name: "Text Classifier", provider: "Internal", version: "v4.0.1", status: "offline", requests: 7410, latency: 310, errorRate: 2.8, accuracy: 88.5, deployment: "staging" },
  { id: "code-model", name: "Code Model", provider: "Internal", version: "v2.6.0", status: "online", requests: 17723, latency: 203, errorRate: 0.42, accuracy: 92.9, deployment: "production" },
  { id: "speech-model", name: "Speech Model", provider: "Internal", version: "v3.2.2", status: "online", requests: 12344, latency: 148, errorRate: 0.37, accuracy: 95.4, deployment: "production" },
  { id: "safety-model", name: "Safety Classifier", provider: "Internal", version: "v2.3.1", status: "warning", requests: 9211, latency: 281, errorRate: 0.77, accuracy: 98.1, deployment: "production" },
  { id: "small-chat", name: "Small Chat", provider: "Internal", version: "v1.8.0", status: "online", requests: 39012, latency: 110, errorRate: 0.18, accuracy: 90.4, deployment: "production" },
  { id: "image-gen", name: "Image Generator", provider: "Internal", version: "v1.2.5", status: "online", requests: 6122, latency: 920, errorRate: 0.62, accuracy: 89.2, deployment: "production" },
  { id: "semantic-search", name: "Semantic Search", provider: "Internal", version: "v5.1.0", status: "online", requests: 44910, latency: 64, errorRate: 0.08, accuracy: 97.9, deployment: "production" }
];

const alerts = [
  { id: "a-1001", severity: "critical", title: "Vision Pro latency elevated", message: "Model inference latency has exceeded the 600ms production threshold.", model: "Vision Pro", timestamp: "2 min ago", resolved: false },
  { id: "a-1002", severity: "warning", title: "GPU utilization above baseline", message: "Cluster gpu-prod-02 has sustained utilization above 85%.", model: "Llama 3.1", timestamp: "8 min ago", resolved: false },
  { id: "a-1003", severity: "warning", title: "Safety Classifier error rate", message: "Error rate increased above the 0.5% operational threshold.", model: "Safety Classifier", timestamp: "14 min ago", resolved: false },
  { id: "a-1004", severity: "info", title: "Deployment completed", message: "Llama 3.1 v3.1.4 successfully deployed to production.", model: "Llama 3.1", timestamp: "31 min ago", resolved: true }
];

const activities = [
  { type: "INFERENCE", message: "Llama 3.1 inference completed", model: "Llama 3.1" },
  { type: "REQUEST", message: "Vision Pro request received", model: "Vision Pro" },
  { type: "SEARCH", message: "Semantic Search vector lookup completed", model: "Semantic Search" },
  { type: "DEPLOY", message: "Mistral Large deployment health check passed", model: "Mistral Large" },
  { type: "INFERENCE", message: "Embeddings XL batch completed", model: "Embeddings XL" }
];

module.exports = { metrics, models, alerts, activities };