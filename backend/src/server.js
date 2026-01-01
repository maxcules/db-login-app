const app = require("./app");
const logger = require("./config/logger");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      action: "SERVER_START",
      port: PORT
    })
  );
  console.log(`API listening on http://localhost:${PORT}`);
});