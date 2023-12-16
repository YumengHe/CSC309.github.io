#!/bin/bash

# This script assumes Python is already installed and available as 'python3'

# Create a Python virtual environment named 'venv' if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate
# when you are done, you can type
# deactivate
# to disable the virtual environment.

# Upgrade pip to the latest version
echo "Upgrading pip..."
pip install --upgrade pip

# Install the project's required dependencies
echo "Installing required Python packages from requirements.txt..."
pip install -r requirements.txt

cd petpal || exit
# Running database migrations (if your project requires them)
echo "Applying database migrations..."
python3 manage.py makemigrations  # Adjust this line as per your project's framework
python3 manage.py migrate # Adjust this line as per your project's framework

echo "Setup is complete."

