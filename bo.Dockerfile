FROM node:20.18.3-alpine AS builder
WORKDIR /source
COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install
COPY . .
RUN NODE_ENV=production npx nx run bo:build:production

FROM node:20.18.3-alpine AS runner
ENV NODE_ENV=production

WORKDIR /app
COPY --from=builder /source/dist /app
COPY --from=builder /source/node_modules /app/node_modules

ENTRYPOINT ["npm", "--prefix", "apps/client", "start"]

