#Get the Base image
FROM node:alpine

#Set the working directory
WORKDIR /app

#Copy the package.json file and runt npm install command
COPY package.json ./
RUN npm install --only=prod
COPY . .

#Provide the starting command 
CMD [ "npm","start" ]