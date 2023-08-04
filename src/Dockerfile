# Use an official Python runtime as a parent image
FROM python:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy the requirements.txt file into the container
COPY ./backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy the backend and database directories into the container
COPY ./backend ./backend/
COPY ./database ./database/

EXPOSE 5000

# Run backend/main.py when the container launches
CMD ["python", "./backend/server.py"]
