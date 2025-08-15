// public/keepAlive.js

(function startKeepAlivePing() {
  const BACKEND_URL = "https://juslin-elim-api.hf.space/health"; // Replace with your real URL
  const intervalMinutes = 5;

  function ping() {
    fetch(BACKEND_URL)
      .then((res) => {
        if (!res.ok) {
          console.warn("Keep-alive ping failed");
        }
      })
      .catch((err) => {
        console.error("Keep-alive error:", err);
      });
  }

  // Initial ping
  ping();
  // Ping every 10 minutes
  setInterval(ping, intervalMinutes * 60 * 5000);
})();
