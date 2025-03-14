FROM node:20.18.3-alpine AS builder
WORKDIR /source
COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install
COPY . .
RUN NODE_ENV=production npx nx run be:build:production

FROM node:20.18.3-alpine AS runner
ENV NODE_ENV=production

WORKDIR /app
COPY --from=builder /source/dist /app
RUN cp /app/apps/be/package*.json . && \
      npm install
COPY .env /app/.env

EXPOSE 3000

CMD ["node", "apps/be/main.js"]
