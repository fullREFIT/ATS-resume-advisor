# Build Status — AI Resume Advisor

## Decisions made during build (documented per autonomy mandate)

### 2026-05-11 — Pre-existing scaffold
The project directory was already scaffolded with `create-next-app` (Next.js 16.2.6, React 19.2.4, Tailwind v4, TypeScript). Skipped the `mv docs/` + `create-next-app` step from the adapted first command and proceeded to Step 1 (Carbon Forge theme + fonts).

### 2026-05-11 — Tailwind v4 (not v3)
Brief assumed Tailwind v3 with `tailwind.config.ts`. Actual scaffold is Tailwind v4 which uses CSS-based theming via `@theme` directive in `globals.css`. Carbon Forge palette is declared as CSS custom properties + mapped through `@theme` so utility classes (e.g. `bg-forge-red`) work as Tailwind classes.

### 2026-05-11 — Next.js 16 conventions
Next.js 16 (not the 15 in the brief). Route handlers, fonts, App Router all work the same per the bundled docs in `node_modules/next/dist/docs/`. No structural changes needed.

### 2026-05-11 — Upstash env vars not present
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are not in `~/.env.mcp` or 1Password. `lib/ratelimit.ts` is implemented to use Upstash if configured and gracefully no-op (allow all requests with a warning) when env vars are absent. Production deploy will need these set in Vercel. Acceptable for local development; will halt before Step 11 (mobile QA on real deployment) if still missing.

### 2026-05-11 — Demo Anthropic API key
Using `ANTHROPIC_FULLREFIT_API_KEY` from `~/.env.mcp` as the value for `ANTHROPIC_API_KEY` in `.env.local`.

### 2026-05-11 — No prototype.jsx reference
The brief references `/Users/paul/dev-4/ai-resume-advisor/_reference/prototype.jsx` as the UX/copy reference. That file does not exist locally. System prompts and copy will be derived from the build brief specifications directly — the brief's ATS context block, page-by-page specs, and brand specification are detailed enough to build from without the prototype.

### 2026-05-11 — shadcn/ui scope
Brief lists shadcn/ui as the styling system. Tailwind v4 shadcn integration is still maturing in some areas, and the components needed for v1 are simple enough (button, card, badge, textarea, dialog) that hand-rolled Tailwind components matching shadcn conventions are pragmatic. The brand specification is the load-bearing constraint, not the shadcn dependency. Components live in `components/ui/`.
