# Portfolio redesign implementation plan

## Objective
Create a distinctive, credible portfolio for Nishan Rajak that communicates backend engineering ability, makes real projects easy to explore, and provides a direct path to contact.

## Findings
- Homepage fails entirely when the external portfolio API is unavailable.
- Repetitive glass panels, motion, background effects, and equal-weight sections obscure the work.
- Global layout downloads a Google font despite already bundling Geist.
- Server portfolio data is not passed to the Redux provider.
- Footer exposes battery and backend status instead of useful navigation.

## Implementation
1. Establish a warm paper / ink / orange visual system, consistent spacing, large editorial typography, subtle rules, accessible focus states, and responsive breakpoints.
2. Build a split homepage hero with backend positioning and an original CSS system diagram; retain factual identity and contact details.
3. Build a reusable project collection with category filters, actual project thumbnails, technology labels, case-study links, demo and GitHub links, and an empty state.
4. Add concise about, capabilities, experience, and contact sections; respect API section visibility and project visibility.
5. Replace the global header and footer with a consistent identity, useful navigation, mobile menu with Escape support, and social links.
6. Restyle the projects and contact routes; preserve existing detailed projects, experience, certificates, hire, and settings functionality.
7. Package existing API seed content as a local fallback, bound upstream request duration, hydrate Redux with server content, and eliminate external font fetching.
8. Remove distracting global cursor/background effects and keep the interface usable with reduced motion.

## Validation
- Install existing dependencies and run TypeScript and production build.
- Run desktop and narrow-screen browser smoke checks, check overflow and console errors.
- Exercise project filters, mobile menu, section links, project details, and email-copy feedback.
- Check fallback rendering without a configured API and document remaining limitations.

## Scope boundaries
No fabricated metrics, employment claims, testimonials, or project outcomes. No backend auth changes or deployment. Existing API remains the authoritative content source when configured and available.

## Completion and verification
- Implemented the homepage, global navigation/footer, project archive, and contact redesign.
- Added CMS fallback content, bounded API requests, server-seeded client state, and local font loading.
- Retained existing project case studies and secondary routes.
- Removed sample employment from the local snapshot and omitted nonexistent local thumbnails.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with two existing warnings in `store/index.ts` and `tailwind.config.js`.
- `npm run build`: passed; 41 pages generated; homepage first-load JS reported as 102 kB.
- Production Chrome smoke checks: passed desktop render, category filters, project detail/archive/contact navigation, native clipboard copy, mobile menu toggle, Escape/close focus, and section navigation.
- No horizontal overflow at 320, 390, and 768 pixels; no browser page errors.
- Desktop and mobile screenshots: `artifacts/portfolio-desktop.png`, `artifacts/portfolio-mobile.png`.

External demo destinations and certificate hosting have not been audited. No deployment was performed.
