window.AppState = {
  page: "dashboard",
  metrics: null,
  models: [],
  filteredModels: [],
  alerts: [],
  activities: [],
  connected: false,
  modelStatus: "all",
  modelSearch: "",
  currentModelPage: 1,
  pageSize: 6,
  chartHistory: [],
  selectedModelId: null,
  theme: localStorage.getItem("ai-ops-theme") || "dark"
};