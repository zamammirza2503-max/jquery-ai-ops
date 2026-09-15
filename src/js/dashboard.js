window.Dashboard = (() => {
  function metricCard(label, value, trend, icon, direction = "up") {
    return `
      <article class="metric-card">
        <div class="metric-top"><span>${label}</span><span class="metric-icon">${icon}</span></div>
        <div class="metric-value">${value}</div>
        <div class="metric-bottom"><span class="trend ${direction}">${trend}</span><span>vs. previous hour</span></div>
      </article>`;
  }

  function renderMetrics(metrics) {
    const cards = [
      metricCard("Requests", Utils.formatCompact(metrics.requests), "↑ 12.4%", "↗", "up"),
      metricCard("Average latency", `${metrics.latency} ms`, "↓ 8.2%", "◷", "up"),
      metricCard("Error rate", `${metrics.errorRate.toFixed(2)}%`, "↓ 0.08%", "!", "up"),
      metricCard("GPU utilization", `${Math.round(metrics.gpuUtilization)}%`, "↑ 4.3%", "▥", "neutral")
    ];
    $("#metric-grid").html(cards.join(""));
  }

  function renderHealth(metrics) {
    const rows = [
      ["GPU utilization", metrics.gpuUtilization],
      ["CPU utilization", metrics.cpuUtilization],
      ["Memory utilization", metrics.memoryUtilization]
    ];
    $("#health-list").html(rows.map(([label, value]) => `
      <div class="health-row">
        <div><div class="health-meta"><span>${label}</span><span>${Math.round(value)}%</span></div><div class="progress"><i style="width:${value}%"></i></div></div>
        <strong>${Math.round(value)}%</strong>
      </div>`).join(""));
  }

  function renderPerformance(models) {
    const active = models.filter(m => m.status !== "offline").slice(0, 4);
    $("#model-performance").html(active.map(model => `
      <div class="performance-row">
        <div class="performance-main"><strong>${Utils.escapeHtml(model.name)}</strong><span>${model.accuracy}% accuracy</span></div>
        <div class="progress"><i style="width:${Math.min(100, model.accuracy)}%"></i></div>
        <div class="performance-sub"><span>${model.requests.toLocaleString()} requests</span><span>${model.latency}ms avg</span></div>
      </div>`).join(""));
  }

  function renderActivity(target, activities) {
    const html = activities.slice(0, 20).map(item => `
      <div class="activity-item">
        <span class="activity-time">${item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"}) : Utils.timeNow()}</span>
        <span class="activity-message">${Utils.escapeHtml(item.message)}</span>
        <span class="activity-type">${Utils.escapeHtml(item.type)}</span>
      </div>`).join("");
    $(target).html(html || '<div class="empty-state">No activity yet.</div>');
  }

  function update(metrics) {
    AppState.metrics = metrics;
    renderMetrics(metrics);
    renderHealth(metrics);
    if (AppState.models.length) renderPerformance(AppState.models);
    Charts.pushPoint(metrics);
  }

  function addActivity(activity) {
    AppState.activities.unshift(activity);
    if (AppState.activities.length > 50) AppState.activities.pop();
    renderActivity("#dashboard-activity", AppState.activities);
    renderActivity("#monitoring-activity", AppState.activities);
  }

  function init() {
    API.getMetrics().done(metrics => update(metrics)).fail(() => UtilsUI.toast("Unable to load system metrics"));
    API.getModels().done(response => {
      AppState.models = response.data;
      renderPerformance(AppState.models);
    });
    API.getActivity().done(response => {
      AppState.activities = response.data.map(item => ({ ...item, timestamp: new Date().toISOString() }));
      renderActivity("#dashboard-activity", AppState.activities);
      renderActivity("#monitoring-activity", AppState.activities);
    });
  }

  return { init, update, addActivity, renderActivity, renderPerformance };
})();