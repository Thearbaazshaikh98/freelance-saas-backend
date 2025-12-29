FROM node:latest

# 1. App directory inside container
WORKDIR /app

# 2. Copy only dependency files
COPY package*.json ./
RUN npm install

# 3. Install prod dependencies
# RUN npm ci --only=production

# 4. Copy rest of app
COPY . .

# 5. App port
EXPOSE 4000

# 6. Start app
CMD ["node", "src/server.js"]