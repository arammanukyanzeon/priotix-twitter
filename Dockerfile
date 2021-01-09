FROM node:12.13.1
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
ADD . /usr/app
CMD [ "npm", "start", "migrate_start" ]