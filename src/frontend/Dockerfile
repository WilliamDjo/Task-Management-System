# Use an official Node runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the current directory contents into the container at /app
COPY . ./

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the application when the container launches
CMD ["npm", "start"]
