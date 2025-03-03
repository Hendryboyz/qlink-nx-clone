FROM node:20.18.3-alpine AS builder
WORKDIR /source
COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install
COPY . .
COPY .env.dev /source/.env

RUN NODE_ENV=production npx nx run client:build:production

FROM node:20.18.3-alpine AS runner
ENV NODE_ENV=production

WORKDIR /app
COPY --from=builder /source/dist /app
COPY --from=builder /source/.env /app/.env
RUN cp /app/apps/client/package*.json . && \
      npm install

EXPOSE 3000

CMD ["npm", "--prefix", "apps/client", "start"]

