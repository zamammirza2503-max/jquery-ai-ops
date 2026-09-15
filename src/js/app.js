window.UtilsUI = {
  toast(message) {
    const toast = $("#toast");
    toast.text(message).addClass("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.removeClass("show"), 2600);
  }
};

$(function () {
  if (AppState.theme === "light") $("body").addClass("light");

  function navigate(page) {
    AppState.page = page;
    $(".nav-item").removeClass("active");
    $(`.nav-item[data-page="${page}"]`).addClass("active");
    $(".page").removeClass("active");
    $(`#page-${page}`).addClass("active");

    const titles = { dashboard: "System Overview", models: "AI Models", monitoring: "Live Monitoring", alerts: "Alerts" };
    $("#page-title").text(titles[page] || "AI Ops");
    $("#sidebar").removeClass("open");
  }

  $(".nav-item").on("click", function () {
    navigate($(this).data("page"));
  });

  $("[data-page-link]").on("click", function () {
    navigate($(this).data("page-link"));
  });

  $("#menu-toggle").on("click", () => $("#sidebar").toggleClass("open"));

  $("#theme-toggle").on("click", function () {
    $("body").toggleClass("light");
    AppState.theme = $("body").hasClass("light") ? "light" : "dark";
    localStorage.setItem("ai-ops-theme", AppState.theme);
    if (AppState.metrics) Charts.createRequestChart(AppState.chartHistory);
  });

  $("#refresh-dashboard").on("click", function () {
    API.getMetrics().done(metrics => {
      Dashboard.update(metrics);
      UtilsUI.toast("Dashboard refreshed");
    }).fail(() => UtilsUI.toast("Refresh failed"));
  });

  $("#request-range").on("change", function () {
    const count = Number($(this).val());
    Charts.createRequestChart(AppState.chartHistory.slice(-count));
  });

  $("#clear-activity").on("click", function () {
    AppState.activities = [];
    Dashboard.renderActivity("#monitoring-activity", []);
    UtilsUI.toast("Activity feed cleared");
  });

  $("#command-open").on("click", openCommandPalette);
  $("#command-backdrop").on("click", function (event) {
    if (event.target === this) closeCommandPalette();
  });

  $(document).on("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openCommandPalette();
    }
    if (event.key === "Escape") {
      closeCommandPalette();
      $("#model-modal-backdrop").removeClass("open");
    }
  });

  function openCommandPalette() {
    $("#command-backdrop").addClass("open");
    $("#command-input").val("").trigger("input").focus();
  }
  function closeCommandPalette() {
    $("#command-backdrop").removeClass("open");
  }

  function commandResults(query = "") {
    const pages = [
      { label: "Dashboard", type: "Page", action: () => navigate("dashboard") },
      { label: "AI Models", type: "Page", action: () => navigate("models") },
      { label: "Live Monitoring", type: "Page", action: () => navigate("monitoring") },
      { label: "Alerts", type: "Page", action: () => navigate("alerts") }
    ];
    const models = AppState.models.map(model => ({
      label: model.name,
      type: `Model · ${model.status}`,
      action: () => Models.openDetails(model.id)
    }));
    const all = [...pages, ...models];
    const filtered = all.filter(item => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

    $("#command-results").html(filtered.length ? filtered.map((item, index) => `
      <button class="command-result ${index === 0 ? "selected" : ""}" data-command-index="${index}">
        <span>${Utils.escapeHtml(item.label)}</span><small>${Utils.escapeHtml(item.type)}</small>
      </button>`).join("") : '<div class="empty-state">No results.</div>');

    $("#command-results").off("click").on("click", ".command-result", function () {
      const index = Number($(this).data("command-index"));
      filtered[index]?.action();
      closeCommandPalette();
    });
  }

  $("#command-input").on("input", function () {
    commandResults($(this).val());
  });

  Dashboard.init();
  Models.init();
  Alerts.init();
  SocketManager.connect();
});