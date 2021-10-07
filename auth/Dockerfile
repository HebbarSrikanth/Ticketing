#Take the base package to build on
FROM node:alpine

#Set the working directory
WORKDIR /app

#Copy only the package.json file
COPY package.json ./
RUN npm install --only=prod
COPY . .

#Starting command when we run the pod
CMD [ "npm","start" ]

