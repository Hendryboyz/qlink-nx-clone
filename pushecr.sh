#!/bin/bash

export AWS_ACCESS_KEY_ID=AKIAQR5EPKYIF373G6OE
export AWS_SECRET_ACCESS_KEY=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
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 038462772752.dkr.ecr.ap-northeast-1.amazonaws.com

docker buildx build --platform=linux/amd64 -t qlink-client:latest -f deployments/local-dockerfiles/client.Dockerfile .
docker run -v $(pwd)/env.docker:/app/.env \
  -p 3002:3000 \
  qlink-client:latest
docker tag qlink-client:latest 038462772752.dkr.ecr.ap-northeast-1.amazonaws.com/qapp-dev-client:latest
docker push 038462772752.dkr.ecr.ap-northeast-1.amazonaws.com/qapp-dev-client:latest

docker buildx build --platform=linux/amd64 -t qlink-backend:latest -f deployments/local-dockerfiles/backend.Dockerfile .
docker run  \
  -v $(pwd)/.env.dev:/app/apps/be/.env \
  -p 3001:3000 \
  qlink-backend:latest
docker tag qlink-backend:latest 038462772752.dkr.ecr.ap-northeast-1.amazonaws.com/qapp-dev-backend:latest
docker push 038462772752.dkr.ecr.ap-northeast-1.amazonaws.com/qapp-dev-backend:latest

docker buildx build --platform=linux/amd64 -t qlink-bockoffice:latest -f deployments/local-dockerfiles/bo.Dockerfile .
#docker run -v $(pwd)/deployments/configs/nginx.dev.conf:/etc/nginx/conf.d/default.conf \
docker run \
  -p 3003:80 \
  qlink-bockoffice:latest
docker run -it --rm -p 3003:80 -v $(pwd)/deployments/configs/nginx.dev.conf:/etc/nginx/conf.d/default.conf --entrypoint /bin/sh qlink-bockoffice:latest
docker tag qlink-bockoffice:latest 038462772752.dkr.ecr.ap-northeast-1.amazonaws.com/qapp-dev-backoffice:latest
docker push 038462772752.dkr.ecr.ap-northeast-1.amazonaws.com/qapp-dev-backoffice:latest
