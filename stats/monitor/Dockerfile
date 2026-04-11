FROM node:22.12.0-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git python3 make g++ libfontconfig1 \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY .yarnrc.yml package.json yarn.lock ./
COPY about/package.json ./about/package.json
COPY docs/package.json ./docs/package.json
COPY stats/package.json ./stats/package.json
COPY stats/monitor/package.json ./stats/monitor/package.json

RUN yarn install --immutable

COPY stats/monitor ./stats/monitor

WORKDIR /app/stats/monitor

CMD ["node", "monitor.js"]
