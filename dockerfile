FROM node:16.18.0-alpine3.15 AS frontend-build

## 複製 project content 至 Docker Image 中
WORKDIR /home/frontend
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY src src/
COPY public public/

## 機器環境
ENV NPM_CONFIG_LOGLEVEL warn
RUN apk add --no-cache git && \
  yarn install --frozen-lockfile && \
  yarn build

# build stage
FROM golang:1.16.10-alpine3.14 AS build-env

ADD server /server
RUN cd /server && go build -o slim-web-server

# final stage
FROM alpine:3.15
WORKDIR /app/server
COPY --from=build-env /server/slim-web-server /app/server/slim-web-server
COPY --from=frontend-build /home/frontend/build /app/build
EXPOSE 8080
ENTRYPOINT ./slim-web-server
