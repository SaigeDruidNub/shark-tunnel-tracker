## Plan: Shark Tunnel Tracker — Full Implementation

**TL;DR:** Complete the starter Vite+React+TS app into a kid-friendly wind tunnel journey tracker. A stylized SVG route map with time-interpolated truck animation is the centerpiece. **Sanity CMS is used only for community photo/video submissions and moderation.** All other content (stops, route schedule, live feed, site copy) is static data defined in TypeScript files in the repo. Deployed to Cloud Run at tracker.kidwind.org as an nginx-served static bundle.

---

### Decisions
- Map art: placeholder SVG shapes/lines/markers built in code; swap real artwork later
- Sanity Studio: `studio/` subfolder in this repo (monorepo)
- Sanity scope: **photo/video submissions only** — all other content is static TS data
- Photo upload auth: scoped public write token in `VITE_SANITY_WRITE_TOKEN` env var
- Mobile layout: stacked vertically (map on top, feed below)
- Animation: pure CSS/SVG — no Framer Motion

---

### Folder Structure

```
shark-tunnel-tracker/
├── src/
│   ├── assets/                   # Static images, placeholder SVGs
│   ├── data/                     # Static content — edit to update the app
│   │   ├── stops.ts              # Array of Stop objects (name, description, video, order, coords)
│   │   ├── routeLegs.ts          # Array of RouteLeg objects (from, to, departureTime, arrivalTime)
│   │   ├── feedItems.ts          # Array of FeedItem objects (title, body, image, publishedAt)
│   │   └── siteContent.ts        # Title, bannerMessage, hero image path
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── map/
│   │   │   ├── RouteMap.tsx      # Container: owns SVG ref + truck position state
│   │   │   ├── MapSVG.tsx        # Illustrated SVG path + terrain decorations
│   │   │   ├── StopMarker.tsx    # Clickable stop circle/icon
│   │   │   └── TruckMarker.tsx   # Animated truck icon along path
│   │   ├── feed/
│   │   │   ├── FeedPanel.tsx     # Right panel, scrollable
│   │   │   └── FeedCard.tsx      # Image + text card
│   │   ├── stops/
│   │   │   └── StopModal.tsx     # Modal: description, media, YouTube embed
│   │   └── photos/
│   │       ├── PhotoGallery.tsx  # Approved submissions grid (fetched from Sanity)
│   │       └── PhotoSubmissionForm.tsx
│   ├── hooks/
│   │   ├── useTruckPosition.ts   # Time interpolation from static routeLegs data
│   │   └── usePhotoSubmissions.ts  # Reads approved submissions from Sanity
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts         # createClient — read client (no auth) + write client (write token)
│   │   │   ├── queries.ts        # GROQ: approved photoSubmissions only
│   │   │   └── imageUrl.ts       # @sanity/image-url builder
│   │   └── truckInterpolation.ts # Pure function: (legs[], now) => { legIndex, t }
│   ├── types/
│   │   ├── stop.ts
│   │   ├── routeLeg.ts
│   │   ├── feedItem.ts
│   │   └── photoSubmission.ts
│   ├── context/
│   │   └── AppContext.tsx        # selectedStopId, dispatch
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── studio/                       # Sanity Studio — photo submission schema only
│   ├── sanity.config.ts
│   ├── schemas/
│   │   ├── index.ts
│   │   └── photoSubmission.ts    # ONLY schema needed
│   └── package.json
├── Dockerfile                    # Multi-stage: node build + nginx serve
├── nginx.conf                    # SPA routing: all paths → index.html
└── .env.example
```

---

### Static Data Shape (src/data/)

**`stops.ts`** — edit this file to add, reorder, or update stops:
```ts
export const stops: Stop[] = [
  {
    id: 'mineral-point',
    order: 1,
    name: 'Mineral Point, WI',
    description: '...',
    videoUrl: 'https://www.youtube.com/watch?v=...',  // optional
    svgX: 720,   // position on the SVG viewBox
    svgY: 140,
  },
  // … 7 more stops …
  {
    id: 'salina',
    order: 8,
    name: 'Salina, KS',
    description: '...',
    videoUrl: '...',
    svgX: 300,
    svgY: 580,
  },
]
```

**`routeLegs.ts`** — edit departure/arrival times to move the truck:
```ts
export const routeLegs: RouteLeg[] = [
  {
    fromStopId: 'mineral-point',
    toStopId: 'stop-2',
    departureTime: new Date('2026-04-10T08:00:00-05:00'),
    arrivalTime:   new Date('2026-04-10T14:00:00-05:00'),
  },
  // … 7 legs total …
]
```

**`feedItems.ts`** — add entries chronologically (newest first):
```ts
export const feedItems: FeedItem[] = [
  {
    id: 'update-1',
    title: 'The shark is on the move!',
    body: 'We just left Mineral Point...',
    imageUrl: '/images/update-1.jpg',  // relative to public/
    publishedAt: new Date('2026-04-10T08:30:00-05:00'),
  },
]
```

---

### Sanity Schema Plan (one schema only)

**`photoSubmission`** document:
- `image` — Sanity image asset
- `videoUrl` — string (YouTube URL, optional)
- `caption` — string
- `submitterName` — string
- `submittedAt` — datetime (default: now)
- `approved` — boolean (default: false) — **editors flip this to publish**
- `relatedStopId` — string (matches a stop id from static data, optional)

No other schemas. Stop data, route legs, feed, and site content are all in `src/data/`.

---

### Component Architecture

```
App
└── AppContext.Provider
    ├── Header               (title + bannerMessage from siteContent.ts)
    └── Layout  (flex-row desktop / column mobile)
        ├── main
        │   ├── RouteMap
        │   │   ├── MapSVG         (SVG: viewBox, route <path>, terrain shapes)
        │   │   ├── StopMarker ×8  (locked / unlocked / active states)
        │   │   └── TruckMarker    (translated via getPointAtLength)
        │   ├── StopModal          (portal, focus trap, ESC to close)
        │   └── PhotoSubmissionForm
        └── aside
            ├── FeedPanel → FeedCard ×N   (reads from feedItems.ts)
            └── PhotoGallery              (reads approved submissions from Sanity)
```

---

### Truck Position Logic

`src/lib/truckInterpolation.ts` — pure function, no Sanity dependency:
```
getTruckPosition(legs: RouteLeg[], now: Date) → { legIndex, t, isMoving }
```
- Finds the leg where `departureTime ≤ now ≤ arrivalTime`
- `t = (now − departure) / (arrival − departure)`, clamped [0, 1]
- Before first departure → position 0; after last arrival → position end
- `RouteMap` maps `(legIndex, t)` to SVG coordinates via `svgPathEl.getPointAtLength(progress × totalLength)`
- CSS `transition: transform 1s ease-in-out` on TruckMarker; paused under `prefers-reduced-motion`

To move the truck, **update dates in `src/data/routeLegs.ts` and redeploy** — no CMS editing needed.

---

### State / Data-Flow

- **Static imports** (`src/data/`) for all stops, route legs, feed items, site content — zero network requests for these
- **useTruckPosition** hook — 1-minute polling interval, calls `getTruckPosition(routeLegs, Date.now())`
- **AppContext** — `selectedStopId: string | null` drives StopModal open/close
- **usePhotoSubmissions** — fetches approved photo submissions from Sanity (read client, no auth) — TanStack Query, refetch every 60s
- **PhotoSubmissionForm** — direct Sanity asset upload + `create` mutation using `VITE_SANITY_WRITE_TOKEN` (scoped write token)
- Feed panel and stop modals: read directly from static data — no fetching, instant

---

### Sanity Client Setup (minimal)

`src/lib/sanity/client.ts`:
```ts
// Read client — no auth required
export const readClient = createClient({ projectId, dataset, apiVersion, useCdn: true })

// Write client — scoped token for photo submissions only
export const writeClient = createClient({ projectId, dataset, apiVersion, token: import.meta.env.VITE_SANITY_WRITE_TOKEN })
```

`src/lib/sanity/queries.ts` — one query:
```groq
*[_type == "photoSubmission" && approved == true] | order(submittedAt desc) { ... }
```

---

### Phased Implementation Plan

**Phase 1 — Foundation** *(unblocks everything)*
1. Install `@sanity/client`, `@sanity/image-url`, `@tanstack/react-query`
2. Create all TypeScript types in `src/types/` (Stop, RouteLeg, FeedItem, PhotoSubmission)
3. Create static data files in `src/data/` with placeholder data for all 8 stops
4. Set up `src/lib/sanity/` (client.ts, queries.ts, imageUrl.ts); add `.env.example`
5. Build `Header.tsx` + `Layout.tsx` (two-column desktop, stacked mobile)

**Phase 2 — Route Map Core** *(depends on Phase 1)*
6. `MapSVG.tsx` — placeholder SVG with route `<path>` connecting 8 stop positions + terrain shapes
7. `StopMarker.tsx` — locked/unlocked/active visual states, keyboard accessible
8. `truckInterpolation.ts` pure function
9. `useTruckPosition.ts` hook (1-min interval)
10. `TruckMarker.tsx` — `getPointAtLength`-driven position + CSS transition
11. `RouteMap.tsx` — composes all map subcomponents

**Phase 3 — Stop Experience** *(depends on Phase 2)*
12. `AppContext.tsx` — selectedStopId + dispatch
13. `StopModal.tsx` — portal dialog with description, YouTube iframe, focus trap, ESC close
14. Progressive unlock: stop unlocked if truck `legIndex` has reached or passed stop's order

**Phase 4 — Live Feed** *(parallel with Phase 3)*
15. `FeedCard.tsx` + `FeedPanel.tsx` — renders from `feedItems.ts` static array
16. `siteContent.ts` → Header banner message (update in code and redeploy)

**Phase 5 — Photo Submissions** *(depends on Phase 1 + Sanity project created)*
17. `sanity init studio/` + write `photoSubmission.ts` schema
18. `PhotoSubmissionForm.tsx` — file input (image/video, 10MB client limit), caption, name, Sanity upload
19. `PhotoGallery.tsx` + `usePhotoSubmissions.ts` — approved-only grid from Sanity

**Phase 6 — Polish + Deployment** *(depends on all prior phases)*
20. Full responsive CSS pass; `prefers-reduced-motion` guard on truck animation
21. Accessibility audit: skip-nav, ARIA labels on SVG markers, modal roles, focus trap
22. `Dockerfile` (Node 20 build → nginx Alpine serve, port 8080) + `nginx.conf`
23. Cloud Run service config + custom domain mapping for tracker.kidwind.org

---

### Accessibility Checklist
- Skip navigation link
- SVG stop markers: `role="button"`, `aria-label="{stop name}"`, `tabIndex={0}`, keyboard Enter/Space
- StopModal: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, ESC key
- Form inputs: labeled, errors linked via `aria-describedby`
- All non-decorative images: `alt` text; YouTube iframe: `title` attribute
- WCAG AA color contrast for all text
- `prefers-reduced-motion`: pause truck CSS transition

### Performance Checklist
- No Sanity network calls for stops, feed, or site content — all static import
- Sanity images: `@sanity/image-url` with `.width().format('webp')`
- Lazy-load `PhotoGallery` and `PhotoSubmissionForm` via `React.lazy` + `Suspense`
- TanStack Query stale-while-revalidate for Sanity photo fetch
- No heavy animation/map libraries
- nginx: gzip + static asset cache headers

---

### Deployment Plan (Google Cloud Run)

**Dockerfile** — two stages:
1. `builder`: `node:20-alpine` → `npm ci` → `npm run build` → `dist/`
2. `server`: `nginx:1.27-alpine` → copy `dist/` + `nginx.conf`, expose port 8080

**nginx.conf** key directives: `listen 8080`, `try_files $uri /index.html`, `gzip on`

**Env vars** (baked at Vite build time via `VITE_*`):
- `VITE_SANITY_PROJECT_ID`
- `VITE_SANITY_DATASET`
- `VITE_SANITY_API_VERSION` (e.g. `2024-01-01`)
- `VITE_SANITY_WRITE_TOKEN` (scoped write token — photo/video submissions only)

**Cloud Run**: port 8080, min 1 instance, us-central1, 256Mi memory
**Domain**: Map `tracker.kidwind.org` → Cloud Run via Custom Domains in Cloud Run console

**Content updates workflow**:
- To move the truck: edit `src/data/routeLegs.ts` → commit → redeploy
- To add a feed update: edit `src/data/feedItems.ts` → commit → redeploy
- To publish a community photo: flip `approved = true` in Sanity Studio → live within 60s (no redeploy)

---

### Risks / Unknowns

1. **Map artwork** — Placeholder SVG is functional but visually basic. `MapSVG.tsx` is isolated for a clean swap when real illustrated art is ready.
2. **Stop list** — Need the exact 8 stops (city names + order + approximate SVG coordinates) before the map path can be drawn accurately.
3. **Sanity account** — A Sanity.io account + project creation is required before Phase 5 begins. Phases 1–4 can proceed without it.
4. **Write token scope** — Scoped write token in frontend env is acceptable for low-stakes public submissions. Consider adding a honeypot field or simple client-side guard against spam.
5. **Video uploads** — If submitters can upload video files (not just YouTube links), Sanity asset upload supports video but sizes can be large. Clarify: YouTube link field only, or direct video file upload?
6. **Content update workflow** — Since stops/feed/timing are in code, any update requires a Git commit + Cloud Run redeploy. Make sure the team is comfortable with this or prefer a CMS for those too.
7. **Domain DNS propagation** — Plan DNS cutover before launch day; minimum 24h buffer.
8. **YouTube on restricted school networks** — `youtube-nocookie.com` embeds help but some districts block YouTube entirely; out of scope.

---

### MVP vs Polish

**MVP (ship first):**
- Placeholder SVG map with 8 static stop markers at hardcoded SVG positions
- Truck position computed from `routeLegs.ts` timestamp data
- Stop modals with description + YouTube embed
- Progressive unlock (truck legIndex vs. stop order)
- Feed panel reading from `feedItems.ts`
- Stacked mobile layout
- Deployed to Cloud Run

**Polish (iterate after MVP):**
- CSS-animated smooth truck sliding along SVG path with `getPointAtLength`
- SVG terrain decorations and illustrated background elements
- Real illustrated map artwork (swap `MapSVG.tsx`)
- Photo/video submission form + Sanity moderation + approved gallery
- Full a11y pass (skip-nav, ARIA, keyboard, focus trap)
- `prefers-reduced-motion` guard
- Performance optimizations (lazy loading, image sizing)

---

### 19 Copilot Handoff Tasks (in order)

1. Install `@sanity/client`, `@sanity/image-url`, `@tanstack/react-query`
2. Create all TypeScript types in `src/types/` (Stop, RouteLeg, FeedItem, PhotoSubmission)
3. Create static data files in `src/data/` (stops.ts, routeLegs.ts, feedItems.ts, siteContent.ts) with placeholder data
4. Set up `src/lib/sanity/` (client.ts, queries.ts, imageUrl.ts) + `.env.example`
5. Build `Header.tsx` + `Layout.tsx` (two-column flex, responsive stacked mobile)
6. Build `MapSVG.tsx` placeholder (SVG route path connecting 8 stop SVG coords + terrain shapes)
7. Build `StopMarker.tsx` with locked/unlocked/active states
8. Write `truckInterpolation.ts` pure function + unit tests
9. Write `useTruckPosition.ts` hook (1-min interval, reads from `routeLegs.ts`)
10. Build `TruckMarker.tsx` with `getPointAtLength` positioning + CSS transition
11. Assemble `RouteMap.tsx` from map subcomponents
12. Set up `AppContext.tsx` (selectedStopId + dispatch)
13. Build `StopModal.tsx` (portal, focus trap, ESC key, YouTube privacy-enhanced iframe)
14. Build `FeedCard.tsx` + `FeedPanel.tsx` (reads from `feedItems.ts`)
15. Wire `siteContent.ts` into `Header.tsx` banner message
16. `sanity init studio/` + write `photoSubmission.ts` schema
17. Build `PhotoSubmissionForm.tsx` + Sanity asset upload + create mutation
18. Build `PhotoGallery.tsx` + `usePhotoSubmissions.ts` (approved-only Sanity query)
19. Full responsive CSS pass + motion media query + accessibility audit
20. `Dockerfile` + `nginx.conf` for Cloud Run deployment
