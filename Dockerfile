FROM node:15.5.1
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
ARG NODE_ENV
ENV NODE_ENV=${DOCKER_ENV}
CMD [ "npm", "run", "migrate_start" ]