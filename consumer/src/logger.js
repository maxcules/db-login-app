const log4js = require("log4js");

log4js.configure({
  appenders: {
    out: { type: "stdout", layout: { type: "messagePassThrough" } }
  },
  categories: { default: { appenders: ["out"], level: "info" } }
});

const logger = log4js.getLogger("consumer");

function logJson(obj) {
  logger.info(JSON.stringify(obj));
}

module.exports = { logJson };