#!/bin/sh
set -e

CDC_SERVER="http://ticdc:8300"
CHANGEFEED_ID="appdb-to-kafka"
SINK_URI="kafka://kafka:9092/tidb_cdc?protocol=canal-json&partition-num=1&replication-factor=1"

echo "Waiting for TiCDC to be ready at ${CDC_SERVER} ..."

i=0
while true; do
  if /cdc cli changefeed list --server="${CDC_SERVER}" >/tmp/cdc_ok 2>/tmp/cdc_err; then
    break
  fi

  i=$((i+1))
  if [ "$i" -ge 60 ]; then
    echo "Timed out waiting for TiCDC to be ready"
    echo "Last error:"
    cat /tmp/cdc_err || true
    exit 1
  fi
  sleep 2
done

echo "TiCDC is ready. Ensuring changefeed exists..."

if /cdc cli changefeed query --server="${CDC_SERVER}" --changefeed-id="${CHANGEFEED_ID}" >/dev/null 2>&1; then
  echo "Changefeed ${CHANGEFEED_ID} already exists. Skipping create."
else
  echo "Creating changefeed ${CHANGEFEED_ID} -> ${SINK_URI}"
  /cdc cli changefeed create \
    --server="${CDC_SERVER}" \
    --changefeed-id="${CHANGEFEED_ID}" \
    --sink-uri="${SINK_URI}"
fi

echo "CDC init done."