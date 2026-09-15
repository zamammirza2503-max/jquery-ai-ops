window.Utils = {
  formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
  },
  formatCompact(value) {
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
  },
  formatPercent(value) {
    return `${Number(value).toFixed(value < 1 ? 2 : 0)}%`;
  },
  timeNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  },
  initials(name) {
    return name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
  },
  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  },
  debounce(fn, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }
};