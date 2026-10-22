FROM node:22.23.4-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git python3 make g++ libfontconfig1 \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY .yarnrc.yml package.json yarn.lock ./
COPY about/package.json ./about/package.json
COPY chain/package.json ./chain/package.json
COPY docs/package.json ./docs/package.json
COPY stats/package.json ./stats/package.json
COPY stats/monitor/package.json ./stats/monitor/package.json
COPY stats/web/package.json ./stats/web/package.json

RUN yarn install --immutable

COPY stats/monitor ./stats/monitor
COPY stats/shared ./stats/shared
COPY stats/web ./stats/web

# The stats dashboard ships in this image too: the web service runs stats/web/server/server.mjs
# from it, so every deploy that rebuilds the monitor also rebuilds the dashboard.
RUN yarn vite build --config stats/web/vite.config.ts

WORKDIR /app/stats/monitor

CMD ["node", "monitor.js"]
