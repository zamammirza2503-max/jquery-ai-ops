window.Charts = (() => {
  let requestChart = null;

  function cssVar(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
  }

  function createRequestChart(history) {
    const canvas = document.getElementById("request-chart");
    if (!canvas) return;

    if (requestChart) requestChart.destroy();

    const text = cssVar("--muted");
    const border = cssVar("--border");
    const accent = cssVar("--accent");

    requestChart = new Chart(canvas, {
      type: "line",
      data: {
        labels: history.map(point => point.label),
        datasets: [{
          data: history.map(point => point.value),
          borderColor: accent,
          backgroundColor: "rgba(124,140,255,.08)",
          fill: true,
          tension: .35,
          borderWidth: 2,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { display: false },
          tooltip: { displayColors: false }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: text, maxTicksLimit: 8, font: { size: 9 } } },
          y: { grid: { color: border }, ticks: { color: text, font: { size: 9 } }, border: { display: false } }
        }
      }
    });
  }

  function pushPoint(metrics) {
    AppState.chartHistory.push({
      label: Utils.timeNow().slice(0, 5),
      value: Math.round(metrics.requests / 100)
    });
    if (AppState.chartHistory.length > 24) AppState.chartHistory.shift();
    createRequestChart(AppState.chartHistory);
  }

  return { createRequestChart, pushPoint };
})();