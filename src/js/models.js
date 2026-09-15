window.Models = (() => {
  function applyFilters() {
    const query = AppState.modelSearch.toLowerCase();
    AppState.filteredModels = AppState.models.filter(model => {
      const matchesStatus = AppState.modelStatus === "all" || model.status === AppState.modelStatus;
      const matchesSearch = `${model.name} ${model.provider} ${model.version}`.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
    AppState.currentModelPage = 1;
    render();
  }

  function statusPill(status) {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="status-pill"><i class="status-dot ${status}"></i>${label}</span>`;
  }

  function render() {
    const start = (AppState.currentModelPage - 1) * AppState.pageSize;
    const pageModels = AppState.filteredModels.slice(start, start + AppState.pageSize);

    if (!pageModels.length) {
      $("#models-table-body").html('<tr><td colspan="7"><div class="empty-state">No models match the current filters.</div></td></tr>');
      renderPagination();
      return;
    }

    $("#models-table-body").html(pageModels.map(model => `
      <tr class="model-row" data-model-id="${Utils.escapeHtml(model.id)}">
        <td><div class="model-cell"><div class="model-avatar">${Utils.initials(model.name)}</div><div><strong>${Utils.escapeHtml(model.name)}</strong><small>${Utils.escapeHtml(model.provider)} · ${Utils.escapeHtml(model.deployment)}</small></div></div></td>
        <td>${Utils.escapeHtml(model.version)}</td>
        <td>${statusPill(model.status)}</td>
        <td>${model.requests.toLocaleString()}</td>
        <td>${model.latency} ms</td>
        <td>${model.errorRate.toFixed(2)}%</td>
        <td><button class="row-action" data-action="details" data-id="${Utils.escapeHtml(model.id)}" aria-label="View details">⋯</button></td>
      </tr>`).join(""));
    renderPagination();
  }

  function renderPagination() {
    const total = AppState.filteredModels.length;
    const pages = Math.max(1, Math.ceil(total / AppState.pageSize));
    const current = AppState.currentModelPage;
    const from = total ? (current - 1) * AppState.pageSize + 1 : 0;
    const to = Math.min(current * AppState.pageSize, total);

    let buttons = `<span class="pagination-label">Showing ${from}–${to} of ${total}</span>`;
    buttons += `<button class="page-button" data-page="${current - 1}" ${current === 1 ? "disabled" : ""}>‹</button>`;
    for (let page = 1; page <= pages; page++) {
      if (pages > 7 && Math.abs(page - current) > 2 && page !== 1 && page !== pages) continue;
      buttons += `<button class="page-button ${page === current ? "active" : ""}" data-page="${page}">${page}</button>`;
    }
    buttons += `<button class="page-button" data-page="${current + 1}" ${current === pages ? "disabled" : ""}>›</button>`;
    $("#models-pagination").html(buttons);
  }

  function openDetails(id) {
    API.getModel(id).done(model => {
      AppState.selectedModelId = id;
      $("#model-modal-content").html(`
        <div class="modal-content">
          <div class="modal-title-row">
            <div class="model-avatar">${Utils.initials(model.name)}</div>
            <div><h2>${Utils.escapeHtml(model.name)}</h2><p>${Utils.escapeHtml(model.provider)} · ${Utils.escapeHtml(model.deployment)}</p></div>
          </div>
          <div class="detail-grid">
            <div class="detail-box"><span>Version</span><strong>${Utils.escapeHtml(model.version)}</strong></div>
            <div class="detail-box"><span>Status</span><strong>${statusPill(model.status)}</strong></div>
            <div class="detail-box"><span>Requests</span><strong>${model.requests.toLocaleString()}</strong></div>
            <div class="detail-box"><span>Average latency</span><strong>${model.latency} ms</strong></div>
            <div class="detail-box"><span>Error rate</span><strong>${model.errorRate.toFixed(2)}%</strong></div>
            <div class="detail-box"><span>Accuracy</span><strong>${model.accuracy}%</strong></div>
          </div>
          <div class="panel-header" style="padding:0 0 10px;border:0"><div><h3>Operational notes</h3><span>Production telemetry snapshot</span></div></div>
          <p style="color:var(--muted);font-size:11px;line-height:1.7">This model is monitored through the AI Operations telemetry stream. Latency, request volume and error rate are updated as simulated production events arrive over WebSockets.</p>
        </div>`);
      $("#model-modal-backdrop").addClass("open");
    }).fail(() => UtilsUI.toast("Could not load model details"));
  }

  function init() {
    API.getModels().done(response => {
      AppState.models = response.data;
      AppState.filteredModels = response.data.slice();
      Dashboard.renderPerformance(AppState.models);
      render();
    });
    $("#model-search").on("input", Utils.debounce(function () {
      AppState.modelSearch = $(this).val();
      applyFilters();
    }, 180));
    $("#model-filters").on("click", ".filter", function () {
      $(".filter").removeClass("active");
      $(this).addClass("active");
      AppState.modelStatus = $(this).data("status");
      applyFilters();
    });
    $("#models-pagination").on("click", ".page-button:not(:disabled)", function () {
      AppState.currentModelPage = Number($(this).data("page"));
      render();
    });
    $("#models-table-body").on("click", "[data-action='details']", function () {
      openDetails($(this).data("id"));
    });
    $("#modal-close").on("click", () => $("#model-modal-backdrop").removeClass("open"));
    $("#model-modal-backdrop").on("click", function (event) {
      if (event.target === this) $(this).removeClass("open");
    });
    $("#add-model").on("click", () => {
      const name = window.prompt("Model name:");
      if (!name) return;
      API.createModel({ name }).done(model => {
        AppState.models.unshift(model);
        applyFilters();
        Dashboard.renderPerformance(AppState.models);
        UtilsUI.toast(`${name} registered successfully`);
      }).fail(xhr => UtilsUI.toast(xhr.responseJSON?.error || "Unable to register model"));
    });
  }

  return { init, openDetails, applyFilters };
})();