# Contributing to MindTrack AI

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes
4. Run tests:
   ```bash
   python manage.py test journals
   ```
5. Commit with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. Push and open a Pull Request

## Branch Naming Convention

| Prefix | Purpose |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `chore/` | Maintenance, cleanup, non-code changes |
| `docs/` | Documentation only |

All feature branches are merged into `master` via Pull Request — direct pushes to `master` are not allowed.

## Commit Message Convention

| Prefix | Purpose |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `chore:` | Maintenance tasks, dependency updates, refactors with no behavior change |
| `test:` | Adding or updating tests |

## Pull Request Checklist

Before opening a PR, please confirm:

- [ ] Code follows the existing project style
- [ ] Tests pass locally (`python manage.py test journals`)
- [ ] New functionality has corresponding tests where applicable
- [ ] No `.env` or secret values are committed
- [ ] PR description clearly explains what changed and why

## Running the Project Locally

See the [README](README.md#-run-locally) for full local setup instructions.

## Code Review Process

- All PRs require the `Django CI` status check to pass before merging.
- At least one review/self-review confirmation is expected before merge.
- Keep PRs focused — one feature or fix per PR makes review easier and keeps history clean.

## Reporting Issues

If you find a bug or have a feature request, please open an issue describing:
- What you expected to happen
- What actually happened
- Steps to reproduce (for bugs)

## Questions?

Reach out via the repository's Issues tab or contact [@Farhan-kalady](https://github.com/Farhan-kalady).