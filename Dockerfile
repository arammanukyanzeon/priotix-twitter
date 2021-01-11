FROM node:15.5.1
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "migrate_start" ]