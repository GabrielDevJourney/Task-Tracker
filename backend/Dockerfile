#apine usage to reduce size of container since no large needed
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose NestJS development port
EXPOSE 3000

# Run development mode with hot reload
CMD ["npm", "run", "start:dev"]