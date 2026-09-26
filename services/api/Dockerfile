# -- build stage: install prod deps only
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# -- runtime stage 
FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
# copy resolved deps and source
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
# drop privileges: run as the built-in non-root 'node' user
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --retries=5 \
    CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD [ "node", "src/server.js" ]
