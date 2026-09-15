window.SocketManager = (() => {
  let socket;
  let reconnectTimer;

  function setConnection(connected) {
    AppState.connected = connected;
    const dot = $("#header-status-dot, #sidebar-status-dot");
    dot.toggleClass("online", connected).toggleClass("offline", !connected);
    $("#header-status").text(connected ? "Operational" : "Reconnecting");
    $("#sidebar-connection").text(connected ? "Connected" : "Reconnecting");
  }

  function connect() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    socket = new WebSocket(`${protocol}://${window.location.host}`);

    socket.onopen = () => setConnection(true);
    socket.onclose = () => {
      setConnection(false);
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connect, 2000);
    };
    socket.onerror = () => setConnection(false);
    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === "telemetry") {
        Dashboard.update(data.metrics);
        Dashboard.addActivity(data.activity);
      }
    };
  }

  return { connect };
})();