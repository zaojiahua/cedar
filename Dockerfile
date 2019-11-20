FROM node:10.15.3 AS build-env

RUN mkdir /app
COPY . /app/cedar_remote
WORKDIR /app/cedar_remote
RUN npm install && npm run build
#RUN  sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list \
#    && apt-get clean \
#    && apt-get update \
#    && apt-get install -y nginx

FROM ubuntu:18.04

RUN  sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list \
    && apt-get clean \
    && apt-get update \
    && apt-get install -y vim \
    && apt-get install -y git \
    && apt-get install -y nginx \
    && mkdir /app

RUN rm /etc/nginx/sites-enabled/default \
    && rm /etc/nginx/sites-available/default

COPY --from=build-env /app/cedar_remote/dist /app/cedar
COPY cedar.nginx.conf /etc/nginx/sites-available/cedar.nginx.conf
#COPY ip.js /app/cedar/ip.js

WORKDIR /app/cedar
RUN ln -s /etc/nginx/sites-available/cedar.nginx.conf /etc/nginx/sites-enabled/cedar.nginx.conf
EXPOSE 80

ENTRYPOINT cp /app/config/ip.js /app/cedar/ip.js && nginx -g "daemon off;"