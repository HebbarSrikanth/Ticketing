#Import the base package
FROM node:alpine

#Set the working directory
WORKDIR /app

#Copy only the package which helps in caching of the build 
#Hence will load only when package.json file is loaded
#Hence first COPY and npm install won't happen when we do changes in other files
COPY package.json .
RUN npm install 
COPY . .

#Mention the starting command
CMD [ "npm","start" ]
