FROM node:12.13.1
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
ADD . /usr/app
EXPOSE 8080
CMD [ "npm", "start", "migrate_start" ]