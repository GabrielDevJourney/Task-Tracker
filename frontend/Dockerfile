FROM node:18

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite development server port
EXPOSE 5173

# Run Vite in development mode with host binding to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]