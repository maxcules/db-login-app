const { Kafka } = require("kafkajs");
const { logJson } = require("./logger");

const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:9092";
const TOPIC = process.env.KAFKA_TOPIC || "tidb_cdc";
const GROUP_ID = process.env.GROUP_ID || "cdc-consumer-group";

function nowIso() {
  return new Date().toISOString();
}

function safeJsonParse(str) {
  try { return JSON.parse(str); } catch { return null; }
}


function toStructuredEvent(canalMsg) {
  const action = (canalMsg?.type || "UNKNOWN").toUpperCase();
  return {
    timestamp: nowIso(),
    action: "DB_CHANGE",
    source: "TiCDC",
    db: canalMsg?.database,
    table: canalMsg?.table,
    op: action,
    rows: Array.isArray(canalMsg?.data) ? canalMsg.data : undefined,
    old: canalMsg?.old,
    ts: canalMsg?.ts
  };
}

async function main() {
  const kafka = new Kafka({ brokers: [KAFKA_BROKER] });
  const consumer = kafka.consumer({ groupId: GROUP_ID });

  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

  logJson({ timestamp: nowIso(), action: "CONSUMER_START", broker: KAFKA_BROKER, topic: TOPIC });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value ? message.value.toString("utf8") : "";
      const parsed = safeJsonParse(value);

      if (!parsed) {
        logJson({ timestamp: nowIso(), action: "DB_CHANGE", op: "UNPARSEABLE", raw: value.slice(0, 500) });
        return;
      }

      const event = toStructuredEvent(parsed);
      logJson(event);
    }
  });
}

main().catch((err) => {
  logJson({ timestamp: nowIso(), action: "CONSUMER_ERROR", error: err?.message || String(err) });
  process.exit(1);
});
