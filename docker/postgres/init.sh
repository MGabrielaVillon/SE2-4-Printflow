#!/bin/sh
# Aplica las migraciones y luego los seeds de PrintFlow, en orden alfabético.
# Postgres lo ejecuta solo cuando crea el volumen por primera vez.
# Para reaplicar desde cero:  docker compose down -v && docker compose up --build
set -e

for dir in migrations seeds; do
  for f in /printflow-db/"$dir"/*.sql; do
    [ -e "$f" ] || continue
    echo "PrintFlow: aplicando $f"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$f"
  done
done
