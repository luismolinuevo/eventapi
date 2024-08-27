# Use the official Node.js image.
FROM node:18

# Set the working directory.
WORKDIR /

# Install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
COPY . .

# Expose the port the app runs on.
EXPOSE 3001

RUN npx prisma generate

# Define the command to run the app.
CMD ["npm", "start"]
