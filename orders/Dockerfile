FROM node:apline

WORKDIR /app

COPY package.json ./
RUN npm install --only=prod
COPY . .

CMD [ "npm","run","start" ]