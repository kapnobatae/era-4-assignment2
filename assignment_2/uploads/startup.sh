#!/bin/bash

# Start virtual display and GUI services
Xvfb :1 -screen 0 1024x768x16 &
export DISPLAY=:1

# Start lightweight window manager
fluxbox &

# Start VNC and noVNC
x11vnc -display :1 -nopw -forever -rfbport 5901 &
websockify --web=/usr/share/novnc/ 6080 localhost:5901 &

# Start Jupyter Notebook
jupyter notebook --no-browser --port=8888 --NotebookApp.token='' --ip=0.0.0.0 --notebook-dir=/home/agent &

# Start Django server
cd /home/agent/agentapp
python3 manage.py runserver 0.0.0.0:5000