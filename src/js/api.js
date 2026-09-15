window.API = {
  getMetrics() {
    return $.ajax({ url: "/api/metrics", method: "GET" });
  },
  getModels(params = {}) {
    return $.ajax({ url: "/api/models", method: "GET", data: params });
  },
  getModel(id) {
    return $.ajax({ url: `/api/models/${encodeURIComponent(id)}`, method: "GET" });
  },
  getAlerts() {
    return $.ajax({ url: "/api/alerts", method: "GET" });
  },
  resolveAlert(id) {
    return $.ajax({ url: `/api/alerts/${encodeURIComponent(id)}/resolve`, method: "PATCH" });
  },
  getActivity() {
    return $.ajax({ url: "/api/activity", method: "GET" });
  },
  createModel(payload) {
    return $.ajax({
      url: "/api/models",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload)
    });
  }
};