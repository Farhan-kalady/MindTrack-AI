# Contributing to MindTrack AI

First off, thank you for considering contributing to MindTrack AI! It's people like you that make open-source software such a great community to learn, inspire, and create.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally: `git clone https://github.com/your-username/mindtrack-ai.git`
3. **Set up the backend** (Django/Python):
   - Navigate to `backend/`
   - Create a virtual environment: `python -m venv venv`
   - Activate it and install requirements: `pip install -r requirements.txt`
   - Set up your `.env` based on `.env.example`
   - Run migrations: `python manage.py migrate`
4. **Set up the frontend** (React/Vite):
   - Navigate to `frontend/`
   - Install dependencies: `npm install`
   - Set up `.env` for Vite.

## Pull Request Process

1. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`
2. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
3. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
4. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent.
5. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.
