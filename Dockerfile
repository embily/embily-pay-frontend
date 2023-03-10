FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt -y update
RUN apt -y install locales
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

RUN apt -y install curl vim build-essential tzdata

RUN curl -sL https://deb.nodesource.com/setup_current.x | bash -

RUN apt-get install -y nodejs

COPY . /app
WORKDIR /app
