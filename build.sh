#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files
python mindtrack_backend/manage.py collectstatic --noinput

# Run database migrations
python mindtrack_backend/manage.py migrate
