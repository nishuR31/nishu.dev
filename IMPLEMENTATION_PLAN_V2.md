# Portfolio second-pass implementation plan

## User feedback
The first redesign is rated 5/10. Dark mode must remain available. This pass should materially improve identity, project storytelling, visual hierarchy, readability, and interaction quality.

## Design direction
A backend engineer’s personal workspace: charcoal surfaces, warm white typography, burnt-orange highlights, technical annotations, generous project imagery, and a carefully designed light equivalent. Dark is the default; saved light/system choices are honored.

## Execution sequence
1. Replace the light-only CSS override with semantic theme tokens shared across homepage and secondary routes. Restore a visible dark/light/system control, pre-paint theme initialization, persistence, system changes, and safe behavior when storage is unavailable.
2. Rebuild hero positioning around Nishan’s backend engineering focus. Add an interactive, explicitly labeled architecture demo with API/auth/data states and code output. Keep the visualization native HTML/CSS/SVG and accessible by keyboard.
3. Give selected work a large lead case study and two supporting projects, with larger screenshots, real project descriptions, problem/solution context, readable tags, repository/demo links, and category filtering.
4. Improve the about portrait treatment, capabilities panels, experience timeline, contact invitation, and footer. Increase small text sizes and create stronger section hierarchy.
5. Add active section navigation and restrained one-time reveal motion. Respect reduced-motion preferences; do not hide content when scripting is unavailable.
6. Preserve CMS fallback, visibility controls, existing routes and real content. No invented metrics or experience.
7. Verify TypeScript, lint, production build, theme initialization/persistence/system changes, demo controls, filter/empty states, clipboard success/failure, mobile navigation, secondary route rendering, and overflow at 320/390/768/1440px.
8. Capture and inspect desktop dark/light and mobile screenshots, then document results and limitations.

## Acceptance criteria
- Dark and light both have complete surface/text/border colors; no light-only illustrations or unreadable controls in dark mode.
- Theme selection survives reload/navigation and system mode follows OS changes.
- Large screens have a distinct lead project, and mobile preserves readable text and touch targets.
- Demo controls, navigation, and contact actions have clear labels, visible focus, and correct state feedback.
- Build and type checks pass; no hydration/page errors in browser checks.

## Implementation outcome
- Replaced light-only overrides with semantic light and dark tokens across public routes.
- Added visible dark/light/system controls, safe local persistence, OS change tracking, cross-tab synchronization, and a pre-paint theme script. Dark is the default.
- Rebuilt hero typography and added the interactive, keyboard-operable architecture study.
- Added a large lead case study with real solution context and two supporting projects; retained filters and outbound links.
- Restyled about, capabilities, experience, contact, certificates, and footer. Corrected the certificates page's missing H1 and retained CMS titles/visibility.
- Added active section navigation, accessible Escape handling, and reduced-motion behavior.
- Increased text size, strengthened light-theme captions, and adjusted orange text to exceed 4.5:1 against its light surfaces (4.72–5.26:1 for tested combinations).

## Verification
- TypeScript and production build passed. Build generated 41 pages; homepage first-load JavaScript is approximately 104 kB.
- Lint passed with one existing warning in `tailwind.config.js`.
- Chrome checks cover dark default, light persistence, system preference updates, unavailable local storage, all architecture controls, project filters, case-study/archive/experience/certificates/contact routes, clipboard success and failure, mobile navigation and Escape focus, reduced motion, and overflow at 320/390/768px in both themes.
- Visual review includes desktop dark/light, mobile dark/light, real project screenshots, and the loaded portrait. The decorative hero asterisk is hidden on mobile to prevent an orphaned line.
- Screenshots are saved as `artifacts/portfolio-v2-*.png`; repeatable browser checks are in `scripts/check-portfolio.mjs`.

## Remaining boundaries
External project demos and remotely hosted credential files were not audited. Contrast checks cover design-token combinations rather than a full independent accessibility audit. No deployment or backend authentication changes were made.
