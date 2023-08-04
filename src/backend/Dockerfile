# Use an official Python runtime as a parent image
FROM python:latest

# Set the working directory in the container to /app
WORKDIR /app

# Install any needed packages specified in requirements.txt
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy the backend and database directories into the container
COPY . /app/backend/
COPY ../database /app/database/

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run backend/main.py when the container launches
CMD ["python", "/app/backend/main.py"]
