window.Alerts = (() => {
  function render() {
    const unresolved = AppState.alerts.filter(alert => !alert.resolved).length;
    $("#nav-alert-count").text(unresolved);

    if (!AppState.alerts.length) {
      $("#alerts-list").html('<div class="empty-state">No alerts.</div>');
      return;
    }

    $("#alerts-list").html(AppState.alerts.map(alert => `
      <div class="alert-item ${alert.resolved ? "resolved" : ""}">
        <i class="alert-severity ${alert.severity}"></i>
        <div>
          <h4>${Utils.escapeHtml(alert.title)}</h4>
          <p>${Utils.escapeHtml(alert.message)}</p>
          <span class="alert-meta">${Utils.escapeHtml(alert.model)} · ${Utils.escapeHtml(alert.timestamp)}</span>
        </div>
        ${alert.resolved ? '<span class="alert-meta">Resolved</span>' : `<button class="alert-action" data-resolve="${Utils.escapeHtml(alert.id)}">Resolve</button>`}
      </div>`).join(""));
  }

  function load() {
    API.getAlerts().done(response => {
      AppState.alerts = response.data;
      render();
    });
  }

  function resolve(id) {
    API.resolveAlert(id).done(() => {
      const alert = AppState.alerts.find(item => item.id === id);
      if (alert) alert.resolved = true;
      render();
      UtilsUI.toast("Alert resolved");
    });
  }

  function init() {
    load();
    $("#alerts-list").on("click", "[data-resolve]", function () {
      resolve($(this).data("resolve"));
    });
    $("#resolve-all").on("click", function () {
      const pending = AppState.alerts.filter(a => !a.resolved);
      if (!pending.length) return UtilsUI.toast("No unresolved alerts");
      let completed = 0;
      pending.forEach(alert => API.resolveAlert(alert.id).always(() => {
        alert.resolved = true;
        completed++;
        if (completed === pending.length) {
          render();
          UtilsUI.toast("All alerts resolved");
        }
      }));
    });
  }

  return { init, load, render };
})();