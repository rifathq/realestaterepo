#!/usr/bin/env bash
# Deploys the COMMITTED masud-agent-site tree to UAT: https://uat.digents.com/masud
# Only committed files ship (git archive), so local test data never reaches UAT.
#
#   bash scripts/deploy-uat.sh
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

HOST="digents-vps"
DIR="/home/ubuntu/masud-site-uat"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
REF="$(git rev-parse --short HEAD)"

if [ "$BRANCH" != "masud-agent-site" ]; then
  echo "✖ UAT /masud serves the masud-agent-site branch; you are on $BRANCH"; exit 1
fi
if [ -n "$(git status --porcelain -- . ':(exclude)data/db.json')" ]; then
  echo "✖ Commit your changes first (data/db.json runtime changes are ignored)"; exit 1
fi

echo "▶ build check (sub-path /masud/)"
APP_BASE=/masud/ npx vite build --outDir "$(mktemp -d)" >/dev/null

echo "▶ shipping $REF to $HOST:$DIR/src"
git archive --format=tar HEAD | ssh "$HOST" "set -e; rm -rf $DIR/src.next; mkdir -p $DIR/src.next; tar -x -C $DIR/src.next; rm -rf $DIR/src; mv $DIR/src.next $DIR/src; echo $REF > $DIR/src/.deployed-ref"

echo "▶ building and starting the container"
ssh "$HOST" "cd $DIR/src && docker compose --env-file $DIR/uat.env -f deploy/uat/docker-compose.yml up -d --build"

echo "▶ inside the container"
ssh "$HOST" "for i in \$(seq 1 30); do docker exec masud-site-uat wget -qO /dev/null http://127.0.0.1:8080/ && break; sleep 2; done; docker exec masud-site-uat wget -qO- http://127.0.0.1:8080/api/feed/listings | head -c 120; echo"

echo "▶ from the internet"
curl -s -o /dev/null -w "  /masud -> %{http_code}\n" https://uat.digents.com/masud
curl -s -o /dev/null -w "  /masud/ -> %{http_code}\n" https://uat.digents.com/masud/
curl -s -o /dev/null -w "  /masud/api/leads (no admin token, expect 401) -> %{http_code}\n" https://uat.digents.com/masud/api/leads
# The public seed login from the repo must be refused on UAT.
DEMO_USER="admin@demo.digenticrealty.com"
DEMO_PW="Admin@12345"
curl -s -o /dev/null -w "  demo admin login (expect 401) -> %{http_code}\n" -X POST -H 'Content-Type: application/json' \
  -d "{\"email\":\"$DEMO_USER\",\"password\":\"$DEMO_PW\"}" https://uat.digents.com/masud/api/auth/login
echo "✅ $REF on UAT: https://uat.digents.com/masud"
