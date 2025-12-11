#!/bin/sh
# wait-for-postgres.sh
# Waits for Postgres to be ready before starting the backend

set -e

host="$1"
shift

cmd="$@"

until pg_isready -h "$host" -p 5432; do
  echo "Waiting for Postgres at $host..."
  sleep 2
done

echo "Postgres is ready! Starting backend..."
exec $cmd
