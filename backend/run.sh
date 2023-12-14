#!/bin/bash

# This script assumes 'venv' and Python are installed, and a virtual environment directory 'venv' exists

# Activate the virtual environment
source venv/bin/activate

# Start the server
echo "Starting the server..."
cd petpal || exit
python manage.py runserver  # Or replace with the command to start your specific server

# The script will continue to run as long as the server is running.
# Deactivating the virtual environment is not needed here as the script would end when the server is stopped (e.g., Ctrl+C).
