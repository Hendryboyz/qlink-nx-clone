FROM node:20.18.3-alpine AS builder
WORKDIR /source
COPY package*.json ./
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install
COPY . .
COPY .env /source/.env


RUN NODE_ENV=production npx nx run bo:build:production

FROM nginx:1.27.4-alpine AS runner
ENV NODE_ENV=production

WORKDIR /app
COPY --from=builder /source/dist/apps/bo /usr/share/nginx/html
COPY ./deployments/configs/nginx.dev.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
