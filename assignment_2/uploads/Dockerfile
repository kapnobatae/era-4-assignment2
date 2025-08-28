# Base image
FROM ubuntu:22.04

# Avoid tzdata prompt during install
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Etc/UTC
RUN ln -fs /usr/share/zoneinfo/Etc/UTC /etc/localtime

# Install system packages
RUN apt-get update && apt-get install -y \
    python3 python3-pip nodejs npm curl git \
    xvfb x11vnc fluxbox xdotool novnc websockify \
    nano unzip tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip3 install --upgrade pip && \
    pip3 install django notebook jupyterlab

# Copy startup script before switching user (so we can chmod as root)
COPY startup.sh /startup.sh
RUN chmod +x /startup.sh

# Create a non-root user
RUN useradd -ms /bin/bash agent
USER agent
WORKDIR /home/agent

# Create Django project safely
RUN django-admin startproject agentapp_temp && \
    mv agentapp_temp /home/agent/agentapp
WORKDIR /home/agent/agentapp

# Expose ports
EXPOSE 5000 8888 5901 6080

# Start the system
CMD ["/startup.sh"]
