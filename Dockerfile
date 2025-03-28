FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS builder
COPY . /usr/src/app
RUN bun install

FROM nginx
WORKDIR /usr/src/app
EXPOSE 8080
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
