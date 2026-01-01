#!/bin/sh
set -e

HOST="tidb"
PORT="4000"

echo "Waiting for TiDB SQL readiness at ${HOST}:${PORT} ..."

# Try for ~3 minutes (90 * 2s)
i=0
until mysql -h "$HOST" -P "$PORT" -u root -e "SELECT 1" >/dev/null 2>&1; do
  i=$((i+1))
  if [ "$i" -ge 90 ]; then
    echo "Timed out waiting for TiDB SQL readiness at ${HOST}:${PORT}"
    exit 1
  fi
  sleep 2
done

echo "TiDB is ready. Initializing schema + seed..."
mysql -h "$HOST" -P "$PORT" -u root < /db/init.sql

echo "DB init done."