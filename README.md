# Nishan Rajak

![logo](public/logo.png)

![Homepage preview](public/homepage.avif)

![Build](https://img.shields.io/github/actions/workflow/status/nishuR31/nishu.dev/ci.yml?branch=main)
![Last Commit](https://img.shields.io/github/last-commit/nishuR31/nishu.dev)
![Node](https://img.shields.io/badge/Node-%3E%3D16-339933?style=flat-square&logo=node.js&logoColor=white)

---

Backend-focused software engineering student building scalable APIs, secure auth flows, and modular backend systems.

## Quick facts

- **Name:** Nishan Rajak (Nishu)
- **Role:** Backend-Focused Software Engineering Student
- **Location:** Raghunathpur, West Bengal
- **Email:** [nishan.developer.dev@gmail.com](mailto:nishan.developer.dev@gmail.com)

## Badges

Tech & tools I'm working with:

<!-- Skill badges: original brand colours from SimpleIcons, logo color chosen for contrast -->

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-1F2937?style=for-the-badge&logo=redis&logoColor=white&label=BullMQ)
![VS%20Code](https://img.shields.io/badge/VS%20Code-0065A9?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Postgres](https://img.shields.io/badge/Postgres-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## About me

I focus on backend system architecture, API design, and robust authentication. My projects emphasise modular code, clear separation of concerns, and reliable error handling.

> Scalable APIs, secure auth, and modular backend systems.

## Featured projects

- **Devclip Hub** — Developer-focused utility hub with modular frontend architecture and productivity-driven tooling.
  - Tech: Next.js · React · JavaScript · TailwindCSS
- **Gh Control** — Power-user GitHub command center with repo, PR, webhook, and job controls in one dashboard.
  - Tech: Next.js · Node.js · MongoDB · Redis · BullMQ
- **Baksy** — Product-focused full-stack application with scalable backend and polished frontend experiences.
  - Tech: React · Node.js · Express · MongoDB

More projects and links are in the portfolio site.

## Skills

- Backend: Node.js, Express, REST APIs, JWT Authentication, Prisma, Mongoose
- Databases & Tools: MongoDB, MySQL, Postman, Git, GitHub
- Frontend (selected): React, Next.js, TailwindCSS, TypeScript

I also help with frontend tasks such as component-level UI polish, responsive layouts, and accessibility improvements when requested.

## Contact

- GitHub: [https://github.com/nishuR31](https://github.com/nishuR31)
- LinkedIn: [https://linkedin.com/in/nishan-rajak-98b2ab3b8](https://linkedin.com/in/nishan-rajak-98b2ab3b8)
- Email: [nishan.developer.dev@gmail.com](nishan.developer.dev@gmail.com)

## Portfolio redesign

The latest implementation plan is in [IMPLEMENTATION_PLAN_V2.md](IMPLEMENTATION_PLAN_V2.md). The original plan remains in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
The public interface defaults to charcoal dark mode with a warm light counterpart, orange accents, an interactive architecture study, featured project case studies, and direct contact actions. The header offers dark, light, and system themes. The preference persists locally, system mode follows OS changes, and pre-paint initialization prevents an incorrect-theme flash.

### Run locally

```sh
npm install
npm run dev
```

### Verify

```sh
npx tsc --noEmit
npm run lint
npm run build
npm run start -- --port 3001
# In another terminal:
node scripts/check-portfolio.mjs
```

The browser check uses installed Google Chrome. Set `CHROME_PATH` for another Chromium executable and `PORTFOLIO_TEST_URL` for another local server. Screenshots are saved in `artifacts/`.

### Content and styling

- `lib/portfolio.ts`: fetches CMS data with a bounded timeout and 5-minute revalidation.
- `.fallback`: local portfolio snapshot generated manually from the API when needed; it is ignored by git.
- `app/portfolio.css`: semantic light/dark tokens and the responsive visual system.
- `components/Providers/ThemeController.tsx`: theme initialization, OS changes, and cross-tab synchronization.
- `components/features/home/ArchitectureDemo.tsx`: accessible API, authentication, and data-layer illustration.
- `components/features/projects/ProjectCollection.tsx`: shared project archive and homepage filters.
- `NEXT_PUBLIC_API_URL`: optional API base URL. The original hosted API remains the default.

Projects without screenshots display a typographic placeholder. Resume links and remote certificate files remain dependent on the content maintained in the CMS.
