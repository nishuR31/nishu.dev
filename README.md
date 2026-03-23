# NewPortfolio

![Build](https://img.shields.io/github/actions/workflow/status/nishuR31/newportfolio/ci.yml?branch=main)
![Last Commit](https://img.shields.io/github/last-commit/nishuR31/newportfolio)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)

Minimal, deployable developer portfolio built with Next.js, Express and a background mail worker.

> NOTE: Do not clone this project from this README — run commands from the existing workspace.

## Demo / Screenshots

Add a preview image at `public/preview.png` and it will show here:

![Preview](public/preview.png)

## Features

- Next.js frontend (React)
- Express API for background job enqueueing (`/sendmail`, `/test`, `/ping`, `/health`)
- Background worker consumes jobs and sends email (BullMQ + Redis on configuration)

## Tech

- Next.js 16
- React 18
- Express
- BullMQ / ioredis (optional)
- Nodemailer

## Contributing

Open an issue or create a PR — keep changes small and focused.

---

Made with ❤️ — Nishan
