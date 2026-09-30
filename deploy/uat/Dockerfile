# Masud Haque agent site, UAT image. Served at https://uat.digents.com/masud
FROM node:22-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY . .
# The site lives under a sub-path on UAT; Vite and the router read this at build time.
ARG APP_BASE=/
ENV APP_BASE=$APP_BASE
RUN npx vite build

ENV NODE_ENV=production
ENV PORT=8080
# The JSON data file is written at runtime (leads), so the app user must own it.
RUN chown -R node:node /app/data
USER node
EXPOSE 8080
CMD ["npx", "tsx", "server.ts"]
